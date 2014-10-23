'use strict';

angular.module('timerDocFullstackApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.map = {
        center: {
            latitude: 48.583,
            longitude: 7.750
        },
        zoom: 14
    };

    //$scope.searchbox = { template:'searchbox.tpl.html', position:'top-left'};
  });
