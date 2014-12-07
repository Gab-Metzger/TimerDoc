/**
 * Created by gabrielmetzger on 23/10/14.
 */
angular
    .module('timerDocFullstackApp')
    .factory('doctorService', doctorService);

doctorService.$inject = ['$http','Auth'];

function doctorService($http, Auth) {
    return {
        getDoctors: getDoctors,
        getDoctorNames: getDoctorNames,
        getDoctor: getDoctor,
        getAdminDoctors: getAdminDoctors,
        deleteDoctor: deleteDoctor,
        addPatient: addPatient,
        removePatient: removePatient,
        updateState: updateState
    };

    function getDoctors() {
        return $http.get('/api/doctors')
            .then(getDoctorsComplete)
            .catch(getDoctorsFailed);

        function getDoctorsComplete(response) {
            var data = response.data;
            for (var i = 0; i < data.length; i++) {
                sortState(data[i]);
            }
            return data;
        }

        function getDoctorsFailed(error) {
            console.log('XHR Failed for getDoctors.' + error.data);
        }
    }

    function getDoctorNames() {
        return $http.get('/api/doctors')
            .then(getDoctorsComplete)
            .catch(getDoctorsFailed);

        function getDoctorsComplete(response) {
            var data = response.data;
            var nameArray = [];
            for (var i = 0; i < data.length; i++) {
                nameArray.push(data[i].lastName + " " + data[i].firstName);
            }
            return nameArray;
        }

        function getDoctorsFailed(error) {
            console.log('XHR Failed for getDoctorNames.' + error.data);
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

    function getAdminDoctors() {
        return $http.get('/api/doctors/admin/'+Auth.getCurrentUser()._id)
            .then(getAdminDoctorsComplete)
            .catch(getAdminDoctorsFailed);

        function getAdminDoctorsComplete(response) {
            //var data = response.data;
            return response.data;
        }

        function getAdminDoctorsFailed(error) {
            console.log('XHR Failed for getAdminDoctors.' + error.data);
        }
    }

    function deleteDoctor(doctor) {
        return $http.delete('/api/doctors/'+doctor._id);
    }

    function addPatient(doctor) {
        var count = doctor.nbPatient;
        count = count+1;
        return $http.put('/api/doctors/'+doctor._id, {"nbPatient":count});
    }

    function removePatient(doctor) {
        var count = doctor.nbPatient;
        count = count-1;
        return $http.put('/api/doctors/'+doctor._id, {"nbPatient":count});
    }

    function updateState(doctor, value) {
        return $http.put('/api/doctors/'+doctor._id, {"state":value});
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
}




