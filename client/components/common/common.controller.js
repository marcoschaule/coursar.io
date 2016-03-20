/**
 * @name        CioCommonCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README.md
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-controllers')
    .controller('CioCommonCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($rootScope, $state, CioAuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************
    
    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signOut = signOut;
    $rootScope.signOut = signOut;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to sign out the user.
     */
    function signOut() {
        return CioAuthService.signOut(function() {
            return $state.transitionTo('home');
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
