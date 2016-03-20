/**
 * @name        CioForgotUsernameCtrl
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
    .controller('CioForgotUsernameCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
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

    vm.forgotUsername = forgotUsername;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to send an email containing a password reset link.
     * @public
     */
    function forgotUsername() {
        var objData = {
            email: vm.modelForgotUsername.email,
        };

        return CioAuthService.forgotUsername(objData, function(objErr) {
            if (objErr) {
                return (vm.states.emailSend = 'error');
            }
            return (vm.states.emailSend = true);
        });
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
