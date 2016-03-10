(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of sign in view.
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
 * State of sign up view.
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
 * State of forgot password view.
 * @type {Object}
 */
var stateHomeForgotUsername = {
    url   : '/forgot-username',
    name  : 'forgotUsername',
    views : {
        simple: {
            controller : 'CioForgotUsernameCtrl as vm',
            templateUrl: 'forgot-username.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of forgot password view.
 * @type {Object}
 */
var stateHomeForgotPassword = {
    url   : '/forgot-password',
    name  : 'forgotPassword',
    views : {
        simple: {
            controller : 'CioForgotPasswordCtrl as vm',
            templateUrl: 'forgot-password.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of reset password view.
 * @type {Object}
 */
var stateHomeResetPassword = {
    url   : '/reset-password/:strRId',
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
            .state(stateHomeForgotUsername)
            .state(stateHomeForgotPassword)
            .state(stateHomeResetPassword)
            ;
    });

// *****************************************************************************

})();
