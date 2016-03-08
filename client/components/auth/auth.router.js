(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of sign in view in home view.
 * @type {Object}
 */
var stateHomeSignIn = {
    url   : '/sign-in',
    name  : 'signIn',
    views : {
        simple: {
            controller : 'CioSignInCtrl as vm',
            templateUrl: 'sign-in.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of sign up view in home view.
 * @type {Object}
 */
var stateHomeSignUp = {
    url   : '/sign-up',
    name  : 'signUp',
    views : {
        simple: {
            controller : 'CioSignUpCtrl as vm',
            templateUrl: 'sign-up.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of reset password view in home view.
 * @type {Object}
 */
var stateHomeResetPassword = {
    url   : '/reset-password/:strRId?',
    name  : 'resetPassword',
    views : {
        simple: {
            controller : 'CioResetPasswordCtrl as vm',
            templateUrl: 'reset-password.template.html',
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
            .state(stateHomeSignIn)
            .state(stateHomeSignUp)
            .state(stateHomeResetPassword)
            ;
    });

// *****************************************************************************

})();
