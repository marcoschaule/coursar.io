/**
 * @name        CioVerifyEmailCtrl
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
    .controller('CioVerifyEmailCtrl', Controller);

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
        emailVerified: false
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.verifyEmail = verifyEmail;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to verify the user's email.
     * @public
     */
    function verifyEmail() {
        var objData = {
            rid: $state.params.strRId,
        };

        return CioAuthService.verifyEmail(objData, function(objErr) {
            vm.states.emailVerified = true;

            if (objErr && '2312' === objErr.code) {
                vm.states.emailVerified = 'expired';
            }
            else if (objErr) {
                vm.states.emailVerified = 'error';
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
        verifyEmail();
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
