'use strict';

angular.module('timerDocFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user', {
        url: '/user',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'vm'
      });
  });