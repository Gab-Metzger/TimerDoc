/**
 * Created by gabrielmetzger on 23/10/14.
 */
angular
    .module('timerDocFullstackApp')
    .factory('doctorService', doctorService);

doctorService.$inject = ['$http'];

function doctorService($http) {
    return {
        getDoctors: getDoctors
    };

    function getDoctors() {
        return $http.get('/api/doctors')
            .then(getDoctorsComplete)
            .catch(getDoctorsFailed);

        function getDoctorsComplete(response) {
            return response.data;
        }

        function getDoctorsFailed(error) {
            console.log('XHR Failed for getAvengers.' + error.data);
        }
    }
}




