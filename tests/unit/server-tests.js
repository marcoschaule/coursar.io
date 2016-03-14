(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// load global helpers
require('./_helpers/path.helper.js');
require('./_helpers/settings.helper.js');

// load specs
require('./server/components/auth/auth.routes.spec.js');
require('./server/components/auth/auth.schema.spec.js');

// *****************************************************************************

})();