/**
 * @name        CioContentOverviewCtrl
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
    .controller('CioContentOverviewCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller(CioContentService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.arrContents = [];

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to initialize the controller.
     * 
     * @private
     */
    function _init() {
         _readContents();
    } _init();

    // *****************************************************************************

    /**
     * Helper function to read all contents.
     *
     * @private
     */
    function _readContents() {
        return CioContentService.readAllContents(function(objErr, objResult) {
            vm.arrContents = objResult.contents;
            console.log(">>> Debug ====================; vm.arrContents:", vm.arrContents, '\n\n');
        });
    }

    // *****************************************************************************
}

// *****************************************************************************

})();
