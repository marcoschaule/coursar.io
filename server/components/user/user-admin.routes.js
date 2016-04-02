(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var UserAdminCtrl = require('./user-admin.controller.js');

// local variables
var _isInit = false;
var _app, _env;

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
    _app    = app;
    _env    = env;
    _isInit = true;

    return {
        public : setPublicRoutes,
        private: setPrivateRoutes,
    };
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * @public
 */
function setPublicRoutes() {
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * @public
 */
function setPrivateRoutes() {

    // PUT routes
    _app.put('/user-admin', UserAdminCtrl.handleRequest);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();