/**
 * Created by gabrielmetzger on 23/10/14.
 */
angular.module('timerDocFullstackApp').factory('Doctor', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/doctors');
        },

        create : function(doctorData) {
            return $http.post('/api/doctors/', doctorData);
        },

        delete : function(id) {
            return $http.delete('/api/doctors/' + id);
        }
    }

}]);