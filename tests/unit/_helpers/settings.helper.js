(function() { 'use strict';
/*istanbul ignore next*/

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path = require('path');

require(path.join(_getBasedir(), 'server/settings/general.settings.js'));
require(path.join(_getBasedir(), 'server/settings/auth.settings.js'));
require(path.join(_getBasedir(), 'server/settings/errors.settings.js'));

// *****************************************************************************

})();