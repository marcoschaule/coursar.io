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

    var _objTimeouts       = {};
    var _numTimeoutDefault = 400; // timeout in milliseconds
    var _strStateRedirect  = 'home';
    var _strUrlSignIn      = '/sign-in';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelSignIn = {};
    vm.formSignIn  = {};
    vm.flags       = {
        isProcessing: false,
    };

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
        var objData;

        // activate processing to deactivate interaction with form
        vm.flags.isProcessing = true;

        // cancel timeout of previous sign up request
        $timeout.cancel(_objTimeouts.signIn);

        // if form is (still) not valid, yet, do nothing
        if (vm.formSignIn.$invalid) {
            return;
        }

        objData = {
            username: vm.modelSignIn.username,
            password: vm.modelSignIn.password,
        };

        return (_objTimeouts.signIn = $timeout(function() {
            return CioComService.put(_strUrlSignIn, objData, function(objErr, objData) {

                // delete timeout promise again
                _objTimeouts.signIn = null;

                // activate interaction with form again
                vm.flags.isProcessing = false;

                // redirect to the user defined entry page
                $state.go(_strStateRedirect);

            });
        }, _numTimeoutDefault));
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
