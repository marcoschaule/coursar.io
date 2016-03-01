(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cio-externals',   ['ui.router']);
angular.module('cio-templates',   []);
angular.module('cio-controllers', []);
angular.module('cio-services',    []);
angular.module('cio-directives',  []);
angular.module('cio-filters',     []);
angular.module('cio',             ['cio-externals', 'cio-templates', 'cio-services', 'cio-directives', 'cio-directives', 'cio-controllers']);

// *****************************************************************************
// Router
// *****************************************************************************

// configure routes
angular
    .module('cio')
    .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/sign-in');
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

})();