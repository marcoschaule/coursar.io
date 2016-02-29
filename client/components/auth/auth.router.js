(function() { 'use strict';

// *****************************************************************************
// Router
// *****************************************************************************

angular
    .module('cio')
    .config(function($stateProvider) {

        $stateProvider
            .state('signIn', {
                url  : '/sign-in',
                views: {
                    simple: {
                        controller : 'CioSignInCtrl as vm',
                        templateUrl: 'sign-in.template.html',
                    },
                },
            })
            .state('signUp', {
                url  : '/sign-up',
                views: {
                    simple: {
                        controller : 'CioSignUpCtrl as vm',
                        templateUrl: 'sign-up.template.html',
                    },
                },
            })
            .state('resetPassword', {
                url  : '/reset-password',
                views: {
                    simple: {
                        controller : 'CioResetPasswordCtrl as vm',
                        templateUrl: 'reset-password.template.html',
                    },
                },
            })
            ;

        // $stateProvider
        //     .state('signIn', {
        //         url        : '/sign-in',
        //         controller : 'CioSignInCtrl as vm',
        //         templateUrl: 'sign-in.template.html',
        //     })
        //     .state('signUp', {
        //         url        : '/sign-up',
        //         controller : 'CioSignUpCtrl as vm',
        //         templateUrl: 'sign-up.template.html',
        //     })
        //     .state('resetPassword', {
        //         url        : '/reset-password',
        //         controller : 'CioResetPasswordCtrl as vm',
        //         templateUrl: 'reset-password.template.html',
        //     })
        //     ;
    });

// *****************************************************************************

})();
