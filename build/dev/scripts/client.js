(function() { 'use strict';

// *****************************************************************************
// Modules
// *****************************************************************************

angular.module('cou-externals',   []);
angular.module('cou-templates',   []);
angular.module('cou-controllers', []);
angular.module('cou-services',    []);
angular.module('cou-directives',  []);
angular.module('cou-filters',     []);
angular.module('cou',             ['cou-externals', 'cou-templates', 'cou-services', 'cou-directives', 'cou-directives', 'cou-controllers']);

// *****************************************************************************

})();