/**
 * @name        CioAccountProfileCtrl
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
    .controller('CioAccountProfileCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($state, CioAccountService) {
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

    vm.readUser = readUser;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to read the user from the server.
     * @public
     */
    function readUser() {
        return CioAccountService.readUser(function(objErr, objUser) {
            console.log(">>> Debug ====================; objUser:", objUser, '\n\n');
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$state', 'CioAccountService'];

// *****************************************************************************

})();
