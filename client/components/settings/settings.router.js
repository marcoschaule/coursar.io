(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateSettingsAccount = {
    url   : '/settings-account',
    name  : 'settingsAccount',
    views : {
        simple: {
            controller : 'CioSettingsAccountCtrl as vm',
            templateUrl: 'settings-account.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateSettingsPrivacy = {
    url   : '/settings-privacy',
    name  : 'settingsPrivacy',
    views : {
        simple: {
            controller : 'CioSettingsPrivacyCtrl as vm',
            templateUrl: 'settings-privacy.template.html',
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
            .state(stateSettingsAccount)
            .state(stateSettingsPrivacy)
            ;
    });

// *****************************************************************************

})();
