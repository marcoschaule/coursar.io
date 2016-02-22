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
objPaths.general = path.join(objPaths.basepath, 'settings', 'general.settings.js');

// *****************************************************************************

/**
 * Database settings path.
 * @type {String}
 */
objPaths.database = path.join(objPaths.basepath, 'settings', 'database.settings.js');
objPaths.db       = objPaths.database;

// *****************************************************************************

/**
 * Errors settings path.
 * @type {String}
 */
objPaths.errors = path.join(objPaths.basepath, 'settings', 'errors.settings.js');

// *****************************************************************************

/**
 * Paths settings path.
 * @type {String}
 */
objPaths.paths = path.join(objPaths.basepath, 'settings', 'paths.settings.js');

// *****************************************************************************

/**
 * Authentication settings path.
 * @type {String}
 */
objPaths.auth = path.join(objPaths.basepath, 'settings', 'auth.settings.js');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    if (!global.settings) {
        global.settings = {};
    }
    
    global.settings.paths = objPaths;
};

// module.exports = objPaths;

// *****************************************************************************

})();