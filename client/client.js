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
// Config and running
// *****************************************************************************

// configure routes
angular.module('cio')
    .config(_configRoutesProvider)
    .config(_configHttpProvider)
    .config(_configTranslationProvider)
    .run(_runSpinner)
    .run(_runAuthentication);

require('../client/client.include.js');

// *****************************************************************************

})();