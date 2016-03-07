(function() { 'use strict';

// *****************************************************************************
// Router
// *****************************************************************************

// X-Requested-With
// X-Referer
angular
    .module('cio-routes')
    .config(function($stateProvider) {

        $stateProvider
            .state('profile', {
                url  : '/account/profile',
                views: {
                    simple: {
                        // controller : 'CioProfileCtrl as vm',
                        templateUrl: 'profile.template.html',
                    },
                },
            })
            .state('signUp', {
                url  : '/account/privacy',
                views: {
                    simple: {
                        // controller : 'CioPrivacyCtrl as vm',
                        templateUrl: 'privacy.template.html',
                    },
                },
            })
            ;
    });

// *****************************************************************************

})();
