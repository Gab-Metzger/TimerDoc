/**
 * Created by gabrielmetzger on 23/10/14.
 */
angular
    .module('timerDocFullstackApp')
    .factory('doctorService', doctorService);

doctorService.$inject = ['$http'];

function doctorService($http) {
    return {
        getDoctors: getDoctors,
        getDoctor: getDoctor
    };

    function getDoctors() {
        return $http.get('/api/doctors')
            .then(getDoctorsComplete)
            .catch(getDoctorsFailed);

        function getDoctorsComplete(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
                sortState(data[i]);
                styleState(data[i]);
            }
            return data;
        }

        function getDoctorsFailed(error) {
            console.log('XHR Failed for getDoctors.' + error.data);
        }
    }

    function getDoctor(id) {
        return $http.get('/api/doctors/'+id)
            .then(getDoctorComplete)
            .catch(getDoctorFailed);

        function getDoctorComplete(response) {
            var data = response.data;
            sortState(data);
            return data;
        }

        function getDoctorFailed(error) {
            console.log('XHR Failed for getDoctor.' + error.data);
        }
    }

    function sortState(data) {
        data.style = {};
        if (data.state === 'close') {
            data.style.label = 'Fermé';
        }
        else if (data.state === 'appointment') {
            data.style.label = 'RdV';
        }
        else if (data.state === 'nothing') {
            data.style.label = 'N/R';
        }
        else {
            data.style.label = (data.nbPatient * data.averageTime) + ' mn';
        }
    }

    function styleState(data) {
        if (data.state === 'close' || data.state === 'nothing') {
            data.style.color = 'marker-labels-grey';
        }
        else if (data.state === 'appointment') {
            data.style.color = 'marker-labels-blue';
        }
        else {
            if ((data.nbPatient * data.averageTime) >= 60) {
                data.style.color = 'marker-labels-red';
            }
            else {
                data.style.color = 'marker-labels-green';
            }
        }
    }
}




