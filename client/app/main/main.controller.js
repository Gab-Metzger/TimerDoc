'use strict';

angular.module('timerDocFullstackApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'Doctor', 'GoogleMapApi'.ns(), function ($scope, $http, socket, Doctor, GoogleMapApi) {

    Doctor.get().success(function (data) {
        $scope.doctors = data;
        socket.syncUpdates('doctor', $scope.doctors);
    });

    $scope.chooseLabelColor = function(doctor) {
        if ((doctor.nbPatient * doctor.averageTime) >= 60) {
            return 'marker-labels-red';
        }
        else {
            return 'marker-labels-green';
        }
    };

    $scope.clickOnMarker = function(doctor) {
        $http.get('/api/doctors/'+doctor._id).success(function(data) {
            console.log(data);
            $scope.doctorDetail = data;
        });
    };

    GoogleMapApi.then(function(maps) {
        maps.visualRefresh = true;
        $scope.defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(40.82148, -73.66450),
            new google.maps.LatLng(40.66541, -74.31715));

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
                            latitude: bounds.getNorthEast().lat(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        southwest: {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getSouthWest().lng()
                        }
                    }

                }
            }


        }
    });

  }]);
