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

function Controller($window, $stateParams, CioAuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.flags = {
        isPasswordVisible: false,
        isEmailSend      : false,
        isResetEnabled   : false,
        isPasswordReset  : false,
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.forgotPassword = forgotPassword;
    vm.resetPassword  = resetPassword;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function forgotPassword() {
        var objData = {
            email: vm.modelForgotPassword.email,
        };

        return CioAuthService.forgotPassword(objData, function(objErr) {
            _resetFlags();
            vm.flags.isEmailSend = true;
        });
    }

    // *****************************************************************************

    function resetPassword() {
        var objData = {
            rid     : $stateParams.strRId,
            password: vm.modelResetPassword.password,
        };

        return CioAuthService.resetPassword(objData, function(objErr) {
            
            _resetFlags();
            vm.flags.isResetEnabled  = true;
            vm.flags.isPasswordReset = 'success';

            if (objErr && '2301' === objErr.code) {
                vm.flags.isPasswordReset = 'error';
            }
            else if (objErr && '2302' === objErr.code) {
                vm.flags.isPasswordReset = 'sessionExpired';
            }
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _init() {
        if ($stateParams.strRId) {
            _resetFlags();
            vm.flags.isResetEnabled = true;
        }
    } _init();

    // *****************************************************************************

    function _resetFlags() {
        vm.flags.isEmailSend     = false;
        vm.flags.isResetEnabled  = false;
        vm.flags.isPasswordReset = false;
    }

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$window', '$stateParams', 'CioAuthService'];

// *****************************************************************************

})();
