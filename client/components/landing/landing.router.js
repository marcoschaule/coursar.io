(function() { 'use strict';

// *****************************************************************************
// Router
// *****************************************************************************

angular
    .module('cio-routes')
    .config(function($stateProvider) {

        $stateProvider
            .state('home', {
                url  : '/',
                views: {
                    simple: {
                        // controller : 'landing.controller.js as vm',
                        templateUrl: 'landing.template.html',
                    },
                },
            })
            ;
    });

// *****************************************************************************

})();
