'use strict';

angular.module('timerDocFullstackApp')
  .controller('MainCtrl', function ($scope, $http, socket, Doctor) {

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

    $scope.defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.82148, -73.66450),
        new google.maps.LatLng(40.66541, -74.31715));

    $scope.map = {};

    $scope.map.bounds = {
        northeast: {
            latitude:$scope.defaultBounds.getNorthEast().lat(),
            longitude:$scope.defaultBounds.getNorthEast().lng()
        },
        southwest: {
            latitude:$scope.defaultBounds.getSouthWest().lat(),
            longitude:-$scope.defaultBounds.getSouthWest().lng()

        }
    }

    $scope.map = {
        center: {
            latitude: 48.5691135,
            longitude: 7.762094
        },
        bounds: {},
        markers: [],
        zoom: 14
    };

    $scope.clickOnMarker = function(doctor) {
        $http.get('/api/doctors/'+doctor._id).success(function(data) {
            console.log(data);
            $scope.doctorDetail = data;
        });
    };

    $scope.searchbox = {};
    $scope.searchbox.options = {};
    $scope.searchbox.options.bounds = {
        northeast: {
            latitude:$scope.defaultBounds.getNorthEast().lat(),
            longitude:$scope.defaultBounds.getNorthEast().lng()
        },
        southwest: {
            latitude:$scope.defaultBounds.getSouthWest().lat(),
            longitude:-$scope.defaultBounds.getSouthWest().lng()

        }
    }
    $scope.searchbox = {
            template:'searchbox.tpl.html',
            position:'top-left',
            options: {
                bounds: {}
            },
        events: {
            places_changed: function (searchBox) {
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
                // For each place, get the icon, place name, and location.
                var bounds = new google.maps.LatLngBounds();
                for (var i = 0, place; place = places[i]; i++) {
                    // Create a marker for each place.
                    /*var marker = {
                        id:i,
                        place_id: place.place_id,
                        name: place.name,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        options: {
                            visible:false
                        },
                        templateparameter: place
                    };
                    newMarkers.push(marker);*/

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
                //$scope.map.markers = newMarkers
            }
        }


        }

  });
