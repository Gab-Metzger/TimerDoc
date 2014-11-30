(function(){
    'use strict';

    angular
        .module('timerDocFullstackApp')
        .controller('AdminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['$http', 'Auth', 'Modal', 'GoogleMapApi'.ns(), 'doctorService'];

    function AdminCtrl($http, Auth, Modal, GoogleMapApi, doctorService) {

        /*jshint validthis: true */
        var vm = this;
        vm.doctor = {};
        vm.addDoctor = addDoctor;
        vm.addPatient = addPatient;
        vm.removePatient = removePatient;
        vm.updateState = updateState;

        activate();

        function activate() {
            return getAdminDoctors().then(function () {
                console.log('Activated Admin View');
            });
        }

        function getAdminDoctors() {
            return doctorService.getAdminDoctors()
                .then(function (data) {
                    vm.doctors = data;
                    return vm.doctors;
                });
        }

        function addDoctor() {
            vm.doctor.adminID = Auth.getCurrentUser()._id;
            vm.doctor.nbPatient = 0;
            vm.doctor.state = 'open';

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': vm.doctor.address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    vm.doctor.coords = {
                        latitude: results[0].geometry.location.k,
                        longitude: results[0].geometry.location.B
                    };
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
                for(var i= 0; i < vm.doctors.length; i++) {
                    if (vm.doctors[i].address === vm.doctor.address) {
                        vm.doctor.coords.latitude += 0.0001;
                    }
                }
                $http.post('/api/doctors', vm.doctor).
                    success(function(data) {
                        vm.doctors.push(data);
                        vm.doctor = {};
                        vm.section1 = false;
                    });
            });

        };

        vm.removeDoctor = Modal.confirm.delete(function(doc) {
            doctorService.deleteDoctor(doc);
            vm.doctors.splice(doc,1);
        });

        function addPatient(doctor) {
            doctorService.addPatient(doctor);
            doctor.nbPatient++;
        };

        function removePatient(doctor) {
            doctorService.removePatient(doctor);
            doctor.nbPatient--;
        };

        function updateState(doctor, value) {
            doctorService.updateState(doctor,value);
            doctor.state = value;
        };
    }
})();

