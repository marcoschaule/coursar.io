(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cio-externals',   ['ui.router', 'ui.bootstrap', 'angular-confirm', 'pascalprecht.translate']);
angular.module('cio-contants',    []);
angular.module('cio-values',      []);
angular.module('cio-templates',   []);
angular.module('cio-controllers', []);
angular.module('cio-services',    []);
angular.module('cio-directives',  []);
angular.module('cio-filters',     []);
angular.module('cio-routes',      []);
angular.module('cio',             [
    'cio-externals',
    'cio-contants',
    'cio-values',
    'cio-templates',
    'cio-services',
    'cio-directives',
    'cio-directives',
    'cio-controllers',
    'cio-routes',
]);

// *****************************************************************************
// Config and running
// *****************************************************************************

// configure routes
angular.module('cio')
    .config(_configRoutesProvider)
    .config(_configHttpProvider)
    .config(_configTranslationProvider)
    .run(_runSpinner)
    .run(_runAuthentication);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup router provider.
 * @private
 * 
 * @param {Provider} $urlRouterProvider  provider of the URL route
 * @param {Provider} $stateProvider      provider of the state
 * @param {Provider} $locationProvider   provider of the location
 */
function _configRoutesProvider($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise(function() {
        window.location = '/404.html';
    });
}

// *****************************************************************************

// injection
_configRoutesProvider.$inject = [
    '$urlRouterProvider',
    '$stateProvider',
    '$locationProvider',
];

// *****************************************************************************

/**
 * Helper function to setup the HTTP provider.
 * @private
 * 
 * @param {Provider} $httpProvider  provider of HTTP
 */
function _configHttpProvider($httpProvider) {
    $httpProvider.defaults.headers.common['X-Access-Token'] = null;
    $httpProvider.defaults.headers.common['X-CSRF-Token']   = null;
}

// injection
_configHttpProvider.$inject = ['$httpProvider'];

// *****************************************************************************

/**
 * Helper function to setup the translation provider.
 * @private
 * 
 * @param {Provider} $translateProvider  provider of the translator
 */
function _configTranslationProvider($translateProvider) {
    $translateProvider.preferredLanguage('en-US');
    $translateProvider.useSanitizeValueStrategy(null); //'sanitize');
}

// injection
_configTranslationProvider.$inject = ['$translateProvider'];

// *****************************************************************************

/**
 * Helper function to setup the spinner runner.
 * @private
 * 
 * @param {Service} $rootScope  service for the root scope
 */
function _runSpinner($rootScope) {
    $rootScope.flags = {
        isProcessing: false,
    };
}

// injection
_runSpinner.$inject = ['$rootScope'];

// *****************************************************************************

/**
 * Helper function to setup the authentication runner.
 * @private
 * 
 * @param {Service} $rootScope      service for the root scope
 * @param {Service} $state          service for the state
 * @param {Service} CioAuthService  service for the authentication
 */
function _runAuthentication($rootScope, $state, CioAuthService) {
    return $rootScope.$on('$stateChangeStart', function(objEvent, objToState) { //, objToParams, objFromState, objFromParams) {
        if (objToState.public || CioAuthService.isSignedIn) {
            return;
        }
        return CioAuthService.testSignedIn(function(objErr, isSignedIn) {
            if (objErr || !isSignedIn) {
                objEvent.preventDefault();
                return $state.go('signIn');
            }
            return;
        });
    });
}

// injection
_runAuthentication.$inject = ['$rootScope', '$state', 'CioAuthService'];

// *****************************************************************************

})();