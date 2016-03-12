(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cio-externals',   ['ui.router', 'pascalprecht.translate']);
angular.module('cio-contants',    []);
angular.module('cio-values',      []);
angular.module('cio-templates',   []);
angular.module('cio-controllers', []);
angular.module('cio-services',    []);
angular.module('cio-directives',  []);
angular.module('cio-filters',     []);
angular.module('cio-routes',      []);
angular.module('cio',             ['cio-externals', 'cio-contants', 'cio-values', 'cio-templates', 'cio-services', 'cio-directives', 'cio-directives', 'cio-controllers', 'cio-routes']);

// *****************************************************************************
// Router
// *****************************************************************************

// configure routes
angular
    .module('cio')
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');
    });

// *****************************************************************************

// configure HTTP default headers
angular
    .module('cio')
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Access-Token'] = null;
        $httpProvider.defaults.headers.common['X-CSRF-Token']   = null;
    });

// *****************************************************************************

// config language
angular
    .module('cio')
    .config(function($translateProvider) {
        $translateProvider.preferredLanguage('en-US');
        $translateProvider.useSanitizeValueStrategy(null); //'sanitize');
    });

// *****************************************************************************

// running the app
angular
    .module('cio')
    .run(function($rootScope) {

        // global flags
        $rootScope.flags = {
            isProcessing: false,
        };
    });

// *****************************************************************************

// auth settings
angular
    .module('cio')
    .run(function($window, $rootScope, $state, CioAuthService) {
        // console.log(">>> Debug ====================; client.js: $window.localStorage:", $window.localStorage, '\n\n');

        return $rootScope.$on('$stateChangeStart', function(objEvent, objToState) { //, objToParams, objFromState, objFromParams) {
            if (!objToState.private || CioAuthService.isSignedIn) {
                return;
            }
            return CioAuthService.testSignedIn(function(objErr, isSignedIn) {
                if (objErr || !isSignedIn) {
                    objEvent.preventDefault();
                    return $state.transitionTo('signIn');
                }
                return;
            });
        });
});

// *****************************************************************************

})();