'use strict';

angular.module('timerDocFullstackApp')
  .controller('AdminCtrl', ['$scope', '$http', 'Auth', 'User', 'Doctor', 'Modal', 'socket', 'GoogleMapApi'.ns(), function ($scope, $http, Auth, User, Doctor, Modal, socket, GoogleMapApi) {

    $scope.doctor = {};

    var adminId = Auth.getCurrentUser()._id;

    $http.get('api/doctors/admin/'+adminId).success(function (data) {
        $scope.doctors = data;
        console.log(data);
        socket.syncUpdates('doctor', $scope.doctors);
    });

    $scope.addDoctor = function() {
        $scope.doctor.adminID = Auth.getCurrentUser()._id;
        $scope.doctor.nbPatient = 0;
        $scope.doctor.state = 'open';
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': $scope.doctor.address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.doctor.coords = {
                    latitude: results[0].geometry.location.k,
                    longitude: results[0].geometry.location.B
                };
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
            $http.post('/api/doctors', $scope.doctor).
                success(function(data) {
                    $scope.doctor = {};
                    $scope.section1 = false;
            });
        });

    };

    $scope.removeDoctor = Modal.confirm.delete(function(doc) {
        $http.delete('/api/doctors/'+doc._id);
    });

    $scope.addPatient = function(doctor) {
        var count = doctor.nbPatient;
        count = count+1;
        $http.put('/api/doctors/'+doctor._id, {"nbPatient":count});
    };

    $scope.removePatient = function(doctor) {
        var count = doctor.nbPatient;
        count = count-1;
        $http.put('/api/doctors/'+doctor._id, {"nbPatient":count});
    };

    $scope.updateState = function(doctor, value) {
        $http.put('/api/doctors/'+doctor._id, {"state":value}).success(function(data) {
            console.log(data);
        });
    };

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('doctor');
    });
  }]);
