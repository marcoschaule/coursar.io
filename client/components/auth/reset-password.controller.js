/**
 * @name        CioResetPasswordCtrl
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
    .controller('CioResetPasswordCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($state, CioAuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.states = {
        passwordReset: false
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.resetPassword = resetPassword;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to reset the password.
     * @public
     */
    function resetPassword() {
        var objData = {
            rid     : $state.params.strRId,
            password: vm.modelResetPassword.password,
        };

        return CioAuthService.resetPassword(objData, function(objErr) {
            vm.states.passwordReset = true;

            if (objErr && '2302' === objErr.code) {
                vm.states.passwordReset = 'expired';
            }
            else if (objErr) {
                vm.states.passwordReset = 'error';
            }
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to initialize this controller.
     */
    function _init() {
        if (!$state.params.strRId) {
            $state.go('home');
        }
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
