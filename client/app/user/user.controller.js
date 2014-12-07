'use strict';

angular.module('timerDocFullstackApp')
    .controller('UserCtrl', ['$scope', 'Auth', 'User', 'doctorService', function ($scope, Auth, User, doctorService) {
        $scope.doctors = [];
        $scope.user = Auth.getCurrentUser();
        $scope.messageSuccess = false;
        $scope.messageError = false;

        activate();

        function activate() {
            return getDoctorNames().then(function () {
                console.log('Activated User View');
            });
        }

        function getDoctorNames() {
            return doctorService.getDoctorNames()
                .then(function (data) {
                    $scope.doctors = data;
                    return $scope.doctors;
                });
        }

         $scope.updateUser = function(user) {
            User.update({ id: user._id }, {
                firstname: user.firstname,
                lastname: user.lastname,
                address: user.address,
                phone: user.phone,
                doctor: user.doctor
            }, function(user) {
                $scope.messageSuccess = true;
            }, function (err) {
                $scope.messageError = true;
            });
        };

    }]);



