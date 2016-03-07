(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of home view.
 * @type {Object}
 */
var stateHome = {
    url        : '/',
    name       : 'home',
    views      : {
        common : {
            templateUrl: 'landing.template.html',
            controller : 'CioLandingCtrl as vm',
        },
    },
};

// *****************************************************************************
// Router
// *****************************************************************************

angular
    .module('cio-routes')
    .config(function($stateProvider) {
        $stateProvider
            .state(stateHome)
            ;
    });

// *****************************************************************************

})();
