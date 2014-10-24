'use strict';

angular.module('timerDocFullstackApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Doctor, Modal, socket) {

    $scope.doctor = {};

    Doctor.get().success(function (data,status) {
        $scope.doctors = data;
        socket.syncUpdates('doctor', $scope.doctors);
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

    $scope.removeDoctor = Modal.confirm.delete(function(doc) {
        $http.delete('/api/doctors/'+doc._id);

        /*angular.forEach($scope.doctors, function(u, i) {
            if (u === doc) {
                $scope.doctors.splice(i, 1);
            }
        });*/
    });

    $scope.addPatient = function(doctor) {
        var count = doctor.nbPatient;
        count = count+1;
        $http.put('/api/doctors/'+doctor._id, {"nbPatient":count}).success(function(data, status) {
            if(err) return console.log(err);
        });
    }

    $scope.removePatient = function(doctor) {
        var count = doctor.nbPatient;
        count = count-1;
        $http.put('/api/doctors/'+doctor._id, {"nbPatient":count}).success(function(data, status) {
            if(err) return console.log(err);
        });
    }

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('doctor');
    });
  });
