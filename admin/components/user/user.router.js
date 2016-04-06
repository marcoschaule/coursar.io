(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of the admin user management view.
 * @type {Object}
 */
var stateAdminUsers = {
    url   : '/users',
    name  : 'users',
    views : {
        navigation: {
            templateUrl: 'layout-navigation.template.html',
        },
        main: {
            controller : 'CioUserCtrl as vm',
            templateUrl: 'user.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of the admin user management view.
 * @type {Object}
 */
var stateAdminUserNew = {
    url   : '/user-new',
    name  : 'userNew',
    views : {
        navigation: {
            templateUrl: 'layout-navigation.template.html',
        },
        main: {
            controller : 'CioUserCtrl as vm',
            templateUrl: 'user-new.template.html',
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
            .state(stateAdminUsers)
            .state(stateAdminUserNew)
            ;
    });

// *****************************************************************************

})();
