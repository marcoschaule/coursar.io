(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateAccountProfile = {
    url   : '/account',
    name  : 'accountProfile',
    views : {
        simple: {
            controller : 'CioAccountProfileCtrl as vm',
            templateUrl: 'account-profile.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateAccountProfileSettings = {
    url   : '/settings',
    name  : 'accountProfileSettings',
    views : {
        simple: {
            controller : 'CioSettingsProfileSettingsCtrl as vm',
            templateUrl: 'account-profile-settings.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateAccountPrivacySettings = {
    url   : '/privacy',
    name  : 'accountPrivacySettings',
    views : {
        simple: {
            controller : 'CioSettingsPrivacySettingsCtrl as vm',
            templateUrl: 'account-privacy-settings.template.html',
        },
    },
};

// *****************************************************************************

/**
 * State of the accounts settings view.
 * @type {Object}
 */
var stateAccountNotificationSettings = {
    url   : '/notifications',
    name  : 'accountNotificationSettings',
    views : {
        simple: {
            controller : 'CioSettingsNotificationSettingsCtrl as vm',
            templateUrl: 'account-notification-settings.template.html',
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
            .state(stateAccountProfile)
            .state(stateAccountProfileSettings)
            .state(stateAccountPrivacySettings)
            .state(stateAccountNotificationSettings)
            ;
    });

// *****************************************************************************

})();
