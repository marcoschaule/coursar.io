(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path               = require('path');
var CreateRouter       = require(paths.core.appendPath('router.class.js'));

var env                = process.env.NODE_ENV || 'dev';
var strFClient         = path.join(__dirname, '../../../.build/', env);
var strFAdmin          = path.join(__dirname, '../../../.build/', env + '-admin');
var objRoutes          = {};

// path exceptions
var arrAdminExceptions = ['/admin/content/media-file'];
var arrUserExceptions  = [];

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the public routes.
 * @type {Object}
 */
objRoutes.public = {
    get: [
        
        // route for all admin GET requests, that are public
        ['/admin/*', (req, res, next) => {
            if (_testUrl(req.url, arrAdminExceptions)) {
                return next();
            }
            return res.sendFile(path.join(strFAdmin, 'layout.html'));
        }],
        
        // route for all client GET requests, that are public
        ['/*', (req, res, next) => {
            if (_testUrl(req.url, arrUserExceptions.concat(arrAdminExceptions))) {
                return next();
            }
            return res.sendFile(path.join(strFClient, 'layout.html'));
        }],
    ],
};

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to test if an exception URL is part of the current URL.
 *
 * @private
 * @param  {String}  strUrl         string of the URL to be tested against
 * @param  {Array}   arrExceptions  array of the exceptions to be tested
 * @return {Boolean}                true of the URL was found
 */
function _testUrl(strUrl, arrExceptions) {
    for (var i = 0; i < arrExceptions.length; i += 1) {
        if (strUrl.indexOf(arrExceptions[i]) >= 0) {
            return true;
        }
    }
    return false;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
