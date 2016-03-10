/**
 * @name        CioForgotPasswordCtrl
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
    .controller('CioForgotPasswordCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller(CioAuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.states = {
        emailSend: false,
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.forgotPassword = forgotPassword;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to send an email containing a password reset link.
     * @public
     */
    function forgotPassword() {
        var objData = {
            email: vm.modelForgotPassword.email,
        };

        return CioAuthService.forgotPassword(objData, function(objErr) {
            if (objErr) {
                return (vm.states.emailSend = 'error');
            }
            return (vm.states.emailSend = true);
        });
    }

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['CioAuthService'];

// *****************************************************************************

})();
