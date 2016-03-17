(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of sign in view.
 * @type {Object}
 */
var stateAuthSignIn = {
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
var stateAuthSignUp = {
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
 * State of sign out view.
 * @type {Object}
 */
var stateAuthSignOut = {
    url   : '/sign-out',
    name  : 'signOut',
    views : {
        simple: {
            controller : 'CioSignOutCtrl as vm',
            templateUrl: 'sign-out.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of forgot password view.
 * @type {Object}
 */
var stateAuthForgotUsername = {
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
var stateAuthForgotPassword = {
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
var stateAuthResetPassword = {
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
            .state(stateAuthSignIn)
            .state(stateAuthSignUp)
            .state(stateAuthSignOut)
            .state(stateAuthForgotUsername)
            .state(stateAuthForgotPassword)
            .state(stateAuthResetPassword)
            ;
    });

// *****************************************************************************

})();
