'use strict';

angular.module('timerDocFullstackApp')
  .controller('MainCtrl', function ($scope, $http, socket, Doctor) {

    Doctor.get().success(function (data,status) {
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

    $scope.map = {
        center: {
            latitude: 48.583,
            longitude: 7.750
        },
        zoom: 14
    };

    $scope.clickOnMarker = function(doctor) {
        $http.get('/api/doctors/'+doctor._id).success(function(data, status) {
            console.log(data);
            $scope.doctorDetail = data;
        });
    };

    $scope.searchbox = { template:'searchbox.tpl.html', position:'top-left'};

  });
