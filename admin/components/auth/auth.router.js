(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of sign in view.
 * @type {Object}
 */
var stateAuthSignIn = {
    url   : '/admin/sign-in',
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
// Router
// *****************************************************************************

angular
    .module('cio-routes')
    .config(function($stateProvider) {
        $stateProvider
            .state(stateAuthSignIn)
            // .state(stateAuthSignOut)
            ;
    });

// *****************************************************************************

})();
