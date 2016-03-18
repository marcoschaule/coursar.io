(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthCtrl = require('./auth.controller.js');

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
        public   : setPublicRoutes,
        authorize: setAuthorization,
    };
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * @public
 */
function setPublicRoutes() {

    // PUT routes
    _app.put('/sign-in',
            AuthCtrl.signIn);
    _app.put('/sign-up',
            AuthCtrl.signUp);
    _app.put('/sign-out',
            AuthCtrl.signOut);
    _app.put('/send-verification-email',
            AuthCtrl.sendVerificationEmail);
    _app.put('/verify-email',
            AuthCtrl.verifyEmail);
    _app.put('/forgot-username',
            AuthCtrl.forgotUsername);
    _app.put('/forgot-password',
            AuthCtrl.forgotPassword);
    _app.put('/reset-password',
            AuthCtrl.resetPassword);
    _app.put('/is-available',
            AuthCtrl.isAvailable);
    _app.put('/is-signed-in',
            AuthCtrl.isSignedIn);
}

// *****************************************************************************

/**
 * Router function to set public routes.
 * @public
 */
// function setPrivateRoutes() {
// }

// *****************************************************************************

/**
 * Router function to set authorization for all following routes.
 * @public
 */
function setAuthorization() {

    // authorization middleware to authorize all following routes
    _app.use(AuthCtrl.authorize);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();