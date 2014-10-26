'use strict';

angular.module('timerDocFullstackApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Doctor, Modal, socket) {

    $scope.doctor = {};

    $http.get('api/doctors', {params: {adminID: Auth.getCurrentUser()._id}}).success(function (data) {
        $scope.doctors = data;
        console.log(data);
        socket.syncUpdates('doctor', $scope.doctors);
    });

    $scope.addDoctor = function() {
        $scope.doctor.adminID = Auth.getCurrentUser()._id;
        $scope.doctor.nbPatient = 0;
        $http.post('/api/doctors', $scope.doctor).
            success(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
                $scope.doctor = {};
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

    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('doctor');
    });
  });
