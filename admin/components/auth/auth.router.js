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
// Router
// *****************************************************************************

angular
    .module('cio-admin-routes')
    .config(function($stateProvider) {
        $stateProvider
            .state(stateAuthSignIn)
            ;
    });

// *****************************************************************************

})();
