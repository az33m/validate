/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("validate",
        ["ui.router", 'textAngular', 'frapontillo.bootstrap-duallistbox', 'ui.bootstrap.datetimepicker', 'voucherCheckLog', 'angular-momentjs', 'satellizer', 'ngFileUpload']);

app.factory('jQuery', [
    '$window',
    function ($window) {
        return $window.jQuery;
    }
]);

app.filter('voucherNum', function () {
    return function (number) {
        if (isNaN(number) || number < 1) {
            return number;
        } else {
            return number.match(/\d{3}(?=\d{2,3})|\d+/g).join("-");
        }
    };
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start;
        return input.slice(start);
    };
});