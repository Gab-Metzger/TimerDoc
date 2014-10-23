'use strict';

angular.module('timerDocFullstackApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Doctor) {

    $scope.doctor = {};

    $scope.me = Auth.getCurrentUser();
    Doctor.get().success(function (data,status) {
        $scope.doctors = data
    });

    $scope.addDoctor = function() {
        $scope.doctor.adminID = Auth.getCurrentUser()._id;
        $scope.doctor.nbPatient = 0;
        $http.post('/api/doctors', $scope.doctor).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                $scope.doctor = {};
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Error");
        });
    }

    $scope.removeDoctor = function(doc) {
        $http.delete('/api/doctors/'+doc._id);
        angular.forEach($scope.doctors, function(u, i) {
            if (u === doc) {
                $scope.doctors.splice(i, 1);
            }
        });
    }
  });
