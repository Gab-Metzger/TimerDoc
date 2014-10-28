'use strict';

angular.module('timerDocFullstackApp')
  .controller('UserCtrl', ['$scope', 'socket', 'Auth', function ($scope, socket, Auth) {

    $scope.userId = Auth.getCurrentUser()._id;

  }]);
