(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path = require('path');

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.paths) {
    global.paths = {};
}
if (!global.settings) {
    global.settings = {};
}
global.paths          = { settings: {} };
global.settings.paths = global.paths;

// *****************************************************************************
// Basic paths
// *****************************************************************************

/**
 * Basic server path.
 * @type {String}
 */
settings.paths.basepath = path.join(process.cwd(), 'server');

/**
 * Basic classes path.
 * @type {String}
 */
paths.classes = path.join(paths.basepath, 'classes');

/**
 * Basic settings path.
 * @type {String}
 */
paths.settings = path.join(paths.basepath, 'settings');

/**
 * Basic libraries path.
 * @type {String}
 */
paths.libs = path.join(paths.basepath, 'libs');

/**
 * Basic components path.
 * @type {String}
 */
paths.components = path.join(paths.basepath, 'components');

/**
 * Basic templates path.
 * @type {String}
 */
paths.templates = path.join(paths.basepath, 'templates');

/**
 * Basic uploads path.
 * @type {String}
 */
paths.uploads = path.join(paths.basepath, '../', '.uploads');

// *****************************************************************************
// Aliases
// *****************************************************************************

// Basepath aliases
settings.paths.base   = settings.paths.basepath;
settings.paths.server = settings.paths.basepath;

// *****************************************************************************

})();