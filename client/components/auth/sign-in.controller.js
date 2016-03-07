/**
 * @name        CioSignInCtrl
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
    .controller('CioSignInCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($timeout, $state, CioComService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _strStateRedirect  = 'home';
    var _strUrlSignIn      = '/sign-in';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelSignIn = {};
    vm.formSignIn  = {};
    vm.flags       = {};

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init   = init;
    vm.signIn = signIn;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function init() {
    } init();

    // *****************************************************************************

    function signIn() {
        var objData, objRequest;

        // if form is (still) not valid, yet, do nothing
        if (vm.formSignIn.$invalid) {
            return;
        }

        objData = {
            username: vm.modelSignIn.username,
            password: vm.modelSignIn.password,
        };
        objRequest = {
            id       : 'sign-in',
            url      : _strUrlSignIn,
            data     : objData,
            isTimeout: true,
        };

        return CioComService.put(objRequest, function(objErr, objData) {

            // redirect to the user defined entry page
            $state.go(_strStateRedirect);
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$timeout', '$state', 'CioComService'];

// *****************************************************************************

})();
