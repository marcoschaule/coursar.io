/**
 * @name        CioUserCtrl
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
    .controller('CioUserCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller(CioUserService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.arrUsers = null;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function readUsers() {
        return CioUserService.readUsers(function(objErr, objResult) {
            if (objErr) {
                // do something
                return;
            }
            vm.arrUsers = objResult.arrUsers;
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _init() {
        readUsers();
    } _init();

    // *****************************************************************************
}

// *****************************************************************************

})();
