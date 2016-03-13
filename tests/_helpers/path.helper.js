(function() { 'use strict';
/*istanbul ignore next*/

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path = require('path');

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to get the base directory of the application.
 *
 * @public
 * @return {String}  string of the base directory
 */
function _getBasedir() {
    var arrPaths = __dirname.split('mean');
    var basedir  = path.join(arrPaths[0], 'mean');
    return basedir;
}

// *****************************************************************************
// Globalization
// *****************************************************************************

global._getBasedir = _getBasedir;

// *****************************************************************************

})();