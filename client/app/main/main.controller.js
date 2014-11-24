(function() {
    'use strict';

    angular
        .module('timerDocFullstackApp')
        .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['socket', 'GoogleMapApi'.ns(), 'geolocation', 'doctorService'];

    function MainCtrl(socket, GoogleMapApi, geolocation, doctorService) {

        /*jshint validthis: true */
        var vm = this;
        vm.doctors = [];
        vm.clickOnMarker = clickOnMarker;

        activate();

        function activate() {
            return getDoctors().then(function () {
                console.log('Activated Main View');
                socket.syncUpdates('doctor', vm.doctors);
            });
        }

        function getDoctors() {
            return doctorService.getDoctors()
                .then(function (data) {
                    vm.doctors = data;
                    return vm.doctors;
                });
        }

        function clickOnMarker(doctor) {
            doctorService.getDoctor(doctor._id).then(function (data) {
                vm.doctorDetail = data;
            })
        };

        GoogleMapApi.then(function (maps) {
            maps.visualRefresh = true;
            vm.defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(48.553493, 7.749963),
                new google.maps.LatLng(48.550886, 7.735511));

            vm.map.bounds = {};

            vm.map.bounds = {
                northeast: {
                    latitude: vm.defaultBounds.getNorthEast().lat(),
                    longitude: vm.defaultBounds.getNorthEast().lng()
                },
                southwest: {
                    latitude: vm.defaultBounds.getSouthWest().lat(),
                    longitude: -vm.defaultBounds.getSouthWest().lng()

                }
            };

            geolocation.getLocation().then(function (data) {
                vm.map.center = {latitude: data.coords.latitude, longitude: data.coords.longitude};
                vm.map.zoom = 14;
            }, function () {
                vm.map.center = {latitude: 46.71109, longitude: 1.7191036};
                vm.map.zoom = 5;
            });

            vm.searchbox.options.bounds = {};
            vm.searchbox.options.bounds = new google.maps.LatLngBounds(vm.defaultBounds.getNorthEast(), vm.defaultBounds.getSouthWest());
        });

        angular.extend(vm, {
            selected: {
                options: {
                    visible: false

                },
                templateparameter: {}
            },
            map: {
                control: {},
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
                template: 'searchbox.tpl.html',
                position: 'top-left',
                options: {
                    bounds: {}
                },
                //parentdiv:'searchBoxParent',
                events: {
                    places_changed: function (searchBox) {
                        var places = searchBox.getPlaces();
                        if (places.length == 0) {
                            return;
                        }
                        // For each place, get the icon, place name, and location.
                        var bounds = new google.maps.LatLngBounds();
                        for (var i = 0, place; place = places[i]; i++) {
                            bounds.extend(place.geometry.location);
                        }

                        vm.map.bounds = {
                            northeast: {
                                latitude: bounds.getNorthEast().lat() + 0.0025822,
                                longitude: bounds.getNorthEast().lng() + 0.0187469
                            },
                            southwest: {
                                latitude: bounds.getSouthWest().lat() - 0.0015458,
                                longitude: bounds.getSouthWest().lng() - 0.0063191
                            }
                        };

                    }
                }


            }
        });
    };
})();

