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
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();