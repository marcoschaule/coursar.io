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

function Controller($http) {
    var vm = this;

    // $httpProvider.defaults.headers.common = { 'X-Access-Token': '' };
    $http.head();
    $http.defaults.headers.common['X-Access-Token'] = '';


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

    function loadCaptcha() {
        // $http.get();
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _init() {
        loadCaptcha();
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$http'];

// *****************************************************************************

})();
