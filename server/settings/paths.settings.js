(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path = require('path');

// *****************************************************************************
// Settings object
// *****************************************************************************

// object paths for export
var objPaths = { settings: {} };

// *****************************************************************************

/**
 * Basic server directory path including all aliases.
 * @type {String}
 */
objPaths.basepath = path.join(process.cwd(), 'server');
objPaths.base     = objPaths.basepath;
objPaths.server   = objPaths.basepath;

// *****************************************************************************

/**
 * General settings path.
 * @type {String}
 */
objPaths.settings.general = path.join(objPaths.basepath, 'settings', 'general.settings.js');

// *****************************************************************************

/**
 * Database settings path.
 * @type {String}
 */
objPaths.settings.database = path.join(objPaths.basepath, 'settings', 'database.settings.js');

// *****************************************************************************

/**
 * Errors settings path.
 * @type {String}
 */
objPaths.settings.errors = path.join(objPaths.basepath, 'settings', 'errors.settings.js');

// *****************************************************************************

/**
 * Paths settings path.
 * @type {String}
 */
objPaths.settings.paths = path.join(objPaths.basepath, 'settings', 'paths.settings.js');

// *****************************************************************************

/**
 * Authentication settings path.
 * @type {String}
 */
objPaths.settings.auth = path.join(objPaths.basepath, 'settings', 'auth.settings.js');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = objPaths;

// *****************************************************************************

})();