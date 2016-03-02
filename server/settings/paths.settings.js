(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path = require('path');

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.paths = { settings: {} };

// *****************************************************************************

/**
 * Basic server directory path including all aliases.
 * @type {String}
 */
settings.paths.basepath = path.join(process.cwd(), 'server');
settings.paths.base     = settings.paths.basepath;
settings.paths.server   = settings.paths.basepath;

// *****************************************************************************

/**
 * General settings path.
 * @type {String}
 */
settings.paths.general = path.join(settings.paths.basepath, 'settings', 'general.settings.js');

// *****************************************************************************

/**
 * Database settings path.
 * @type {String}
 */
settings.paths.database = path.join(settings.paths.basepath, 'settings', 'database.settings.js');
settings.paths.db       = settings.paths.database;

// *****************************************************************************

/**
 * Errors settings path.
 * @type {String}
 */
settings.paths.errors = path.join(settings.paths.basepath, 'settings', 'errors.settings.js');

// *****************************************************************************

/**
 * Paths settings path.
 * @type {String}
 */
settings.paths.paths = path.join(settings.paths.basepath, 'settings', 'paths.settings.js');

// *****************************************************************************

/**
 * Authentication settings path.
 * @type {String}
 */
settings.paths.auth = path.join(settings.paths.basepath, 'settings', 'auth.settings.js');

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();