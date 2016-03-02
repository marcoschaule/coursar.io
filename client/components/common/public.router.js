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
                        templateUrl: 'home.template.html',
                    },
                },
            })
            ;
    });

// *****************************************************************************

})();
