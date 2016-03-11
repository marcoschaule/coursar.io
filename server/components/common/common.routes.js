(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// Includes
var path     = require('path');
var AuthCtrl = require('../auth/auth.controller.js');

// local variables
var _isInit          = false;
var _app, _env, _strStaticFolder;

/**
 * Array of all public routes. Every route must be 
 * registered here before it can be used.
 * 
 * @type {Array}
 */
var _arrRoutesPublic = [ // TODO: remove
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-username',
    '/forgot-password',
    '/reset-password/:lowerCaseCharsAndNumbers',
];

// *****************************************************************************
// Routes linking
// *****************************************************************************

/**
 * Router function to init the router.
 * @public
 * 
 * @param  {Object} app  object of express app
 * @param  {String} env  string of current app's environment
 * @return {Object}      object of setter functions
 */
function init(app, env) {
    _app             = app;
    _env             = env;
    _strStaticFolder = _strStaticFolder = path.join(__dirname, '../../../.build/', env);
    _isInit          = true;

    return {
        public : setPublicRoutes,
        private: setPrivateRoutes,
    };
}

// *****************************************************************************

/**
 * Function to set all public GET routes.
 * @public
 */
function setPublicRoutes() {
    if (!_isInit) {
        throw new Error('Router must be initialized first!');
    }

    // route for all GET requests, that are public
    _app.get('/*', (req, res, next) => {
        res.sendFile(path.join(_strStaticFolder, 'layout.html'));
    });
}

// *****************************************************************************

/**
 * Function to set all private GET routes.
 * @public
 */
function setPrivateRoutes() {
    if (!_isInit) {
        throw new Error('Router must be initialized first!');
    }
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to get all public routes as a regular expression.
 * @private
 * 
 * @return {Regex}  regular expression of all public routes
 */
function _getPublicRoutes() { // TODO: remove
    var _arrRoutesPublicLocal = _arrRoutesPublic.map(str => escapeRegex(str));
    var regexRoutesPublic     = new RegExp('^(' + _arrRoutesPublicLocal.join('|') + ')$');
    return regexRoutesPublic;
}

// *****************************************************************************

/**
 * Helper function to escape a string for a regular expression.
 * @private
 * 
 * @param  {String} strSource  string of the source
 * @return {String}            string of the result
 */
function escapeRegex(strSource) { // TODO: remove
    var strResult = strSource;
    strResult = strResult.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    strResult = strResult.replace(':lowerCaseCharsAndNumbers', '[0-9a-z\\-]+');
    return strResult;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();