(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthAdminCtrl = require('./auth-admin.controller.js');

// local variables
var _isInit = false;
var _app, _env;

// *****************************************************************************
// Routes linking
// *****************************************************************************

/**
 * Router function to init the router.
 * 
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
        public   : setPublicRoutes,
        private  : setPrivateRoutes,
        authorize: setAuthorization,
    };
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * 
 * @public
 */
function setPublicRoutes() {

    // PUT routes
    _app.put('/admin/sign-in',     
            AuthAdminCtrl.signIn);
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * 
 * @public
 */
function setPrivateRoutes() {

    // PUT routes
    _app.put('/admin/is-signed-in',
            AuthAdminCtrl.isSignedIn);
}

// *****************************************************************************

/**
 * Router function to set authorization for all following routes.
 * 
 * @public
 */
function setAuthorization() {

    // authorization middleware to authorize all following routes
    _app.use(AuthAdminCtrl.authorize);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();