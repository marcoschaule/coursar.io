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
// Extension functions
// *****************************************************************************

/**
 * String extension function to append a path to the current string.
 *
 * @public
 * @param  {String} strPathToAppend  string to append to current path
 * @return {String}                  string of combined paths
 */
String.prototype.appendPath = function(strPathToAppend) {
    return path.join(this, strPathToAppend);
};


// *****************************************************************************
// Basic paths
// *****************************************************************************

/**
 * Basic server path.
 * @type {String}
 */
settings.paths.basepath = process.cwd().appendPath('server');

/**
 * Basic core path.
 * @type {String}
 */
paths.core = 'core';

/**
 * Basic settings path.
 * @type {String}
 */
paths.settings = 'settings';

/**
 * Basic libraries path.
 * @type {String}
 */
paths.libs = 'libs';

/**
 * Basic components path.
 * @type {String}
 */
paths.components = 'components';

/**
 * Basic templates path.
 * @type {String}
 */
paths.templates = 'templates';

/**
 * Basic uploads path.
 * @type {String}
 */
paths.uploads = '../.uploads';

// *****************************************************************************
// Aliases
// *****************************************************************************

// Basepath aliases
settings.paths.base   = settings.paths.basepath;
settings.paths.server = settings.paths.basepath;

// *****************************************************************************
// Path functions
// *****************************************************************************

function appendPaths() {
    var arrKeys = Object.keys(paths);
    for (var i = 0; i < arrKeys.length; i += 1) {
        if ('basepath' === arrKeys[i]) {
            continue;
        }
        paths[arrKeys[i]] = paths.basepath.appendPath(paths[arrKeys[i]]);
    }
} appendPaths();

// *****************************************************************************

})();