/**
 * Created by gabrielmetzger on 06/11/14.
 */
angular.module('timerDocFullstackApp').filter('breakFilter', function () {
    return function (text) {
        if (text !== undefined) return text.replace(/\n/g, '<br />');
    };
});