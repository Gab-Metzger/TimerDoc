(function(){
    'use strict';

    angular
        .module('timerDocFullstackApp')
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['socket', 'Auth'];

    function UserCtrl(socket, Auth) {
        var vm = this;

        vm.username = Auth.getCurrentUser().name;
    }
})();





