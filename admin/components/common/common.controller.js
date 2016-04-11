/**
 * @name        CioCommonCtrl
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
    .controller('CioCommonCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($state) {
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

    vm.ifStateIncludes = ifStateIncludes;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to test if current state includes a given string.
     *
     * @public
     * @param  {String}  strNeedle  string of the context to be included
     * @return {Boolean}            true if context is included in state name
     */
    function ifStateIncludes(strNeedle) {
        return $state.current.name.indexOf(strNeedle) >= 0;
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

})();
