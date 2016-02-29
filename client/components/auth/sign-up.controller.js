/**
 * @name        CioSignUpCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-controllers')
    .controller('CioSignUpCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($sce, $http) {
    var vm = this;

    // $httpProvider.defaults.headers.common = { 'X-Access-Token': '' };

    // var objRequest = {
    //     method: 'POST',
    //     url: '/',
    // };

    // $http(objRequest).then(function(objResponse) {
    //     $http.defaults.headers.common['X-Access-Token'] = objResponse.headers('X-Access-Token');
    // });


    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    // function loadCaptcha() {
    //     $http.post('/captcha').then(function(objResponse) {
    //         vm.strCaptcha = $sce.trustAsHtml(objResponse.data.captcha);
    //         console.log(">>> Debug ====================; objResponse.data:", objResponse.data, '\n\n');
    //     });
    // }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _init() {
        loadCaptcha();
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$sce', '$http'];

// *****************************************************************************

})();
