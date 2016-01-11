(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cio-externals',   []);
angular.module('cio-templates',   []);
angular.module('cio-controllers', []);
angular.module('cio-services',    []);
angular.module('cio-directives',  []);
angular.module('cio-filters',     []);
angular.module('cio',             ['cio-externals', 'cio-templates', 'cio-services', 'cio-directives', 'cio-directives', 'cio-controllers']);

// *****************************************************************************

})();