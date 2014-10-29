'use strict';

angular.module('timerDocFullstackApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'Doctor', 'GoogleMapApi'.ns(), function ($scope, $http, socket, Doctor, GoogleMapApi) {

    Doctor.get().success(function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].state === 'close') {
                data[i].time = 'Fermé';
            }
            else if (data[i].state === 'appointment') {
                data[i].time = 'RdV';
            }
            else {
                data[i].time = (data[i].nbPatient * data[i].averageTime) + ' mn';
            }
        }
        $scope.doctors = data;
        socket.syncUpdates('doctor', $scope.doctors);
    });

    $scope.chooseLabelColor = function(doctor) {

        if(doctor.state === 'close' || doctor.state === 'appointment') {
            return 'marker-labels-grey';
        }
        else {
            if ((doctor.nbPatient * doctor.averageTime) >= 60) {
                return 'marker-labels-red';
            }
            else {
                return 'marker-labels-green';
            }
        }

    };

    $scope.clickOnMarker = function(doctor) {
        $http.get('/api/doctors/'+doctor._id).success(function(data) {
            if (data.state === 'close') {
                data.time = 'Fermé';
            }
            else if (data.state === 'appointment') {
                data.time = 'RdV';
            }
            else {
                data.time = (data.nbPatient * data.averageTime) + ' mn';
            }
            $scope.doctorDetail = data;
        });
    };

    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(48.553493, 7.749963),
            new google.maps.LatLng(48.550886, 7.735511));

        $scope.map.bounds = {};

        $scope.map.bounds = {
            northeast: {
                latitude: $scope.defaultBounds.getNorthEast().lat(),
                longitude: $scope.defaultBounds.getNorthEast().lng()
            },
            southwest: {
                latitude: $scope.defaultBounds.getSouthWest().lat(),
                longitude: -$scope.defaultBounds.getSouthWest().lng()

            }
        };

        $scope.searchbox.options.bounds = {};
        $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
    });

    angular.extend($scope, {
        selected: {
            options: {
                visible:false

            },
            templateparameter: {}
        },
        map: {
            control: {},
            center: {
                latitude: 48.5691135,
                longitude: 7.7620942
            },
            zoom: 14,
            dragging: false,
            bounds: {},
            idkey: 'place_id',
            events: {
                idle: function (map) {
                    var bounds = map.getBounds();
                    var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                    //console.log("ne bounds " + ne.lat() + ", " + ne.lng());
                    var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                    //console.log("sw bounds " + sw.lat() + ", " + sw.lng());
                }
            }
        },
        searchbox: {
            template:'searchbox.tpl.html',
            position:'top-left',
            options: {
                bounds: {}
            },
            //parentdiv:'searchBoxParent',
            events: {
                places_changed: function (searchBox) {
                    var places = searchBox.getPlaces()
                    if (places.length == 0) {
                        return;
                    }
                    // For each place, get the icon, place name, and location.
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0, place; place = places[i]; i++) {
                        bounds.extend(place.geometry.location);
                    }

                    $scope.map.bounds = {
                        northeast: {
                            latitude: bounds.getNorthEast().lat()+0.0025822,
                            longitude: bounds.getNorthEast().lng()+0.0187469
                        },
                        southwest: {
                            latitude: bounds.getSouthWest().lat()-0.0015458,
                            longitude: bounds.getSouthWest().lng()-0.0063191
                        }
                    };

                }
            }


        }
    });

  }]);
