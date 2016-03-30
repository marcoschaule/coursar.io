(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cio-admin-externals',   ['ui.router', 'pascalprecht.translate']);
angular.module('cio-admin-contants',    []);
angular.module('cio-admin-values',      []);
angular.module('cio-admin-templates',   []);
angular.module('cio-admin-controllers', []);
angular.module('cio-admin-services',    []);
angular.module('cio-admin-directives',  []);
angular.module('cio-admin-filters',     []);
angular.module('cio-admin-routes',      []);
angular.module('cio-admin', [
    'cio-admin-externals',
    'cio-admin-contants',
    'cio-admin-values',
    'cio-admin-templates',
    'cio-admin-services',
    'cio-admin-directives',
    'cio-admin-directives',
    'cio-admin-controllers',
    'cio-admin-routes',
]);

// *****************************************************************************
// Config and running
// *****************************************************************************

// configure routes
angular.module('cio-admin')
    .config(_configRoutesProvider)
    .config(_configHttpProvider)
    .config(_configTranslationProvider)
    .run(_runSpinner)
    .run(_runAuthentication);

require('../client/client.include.js');

// *****************************************************************************

})();