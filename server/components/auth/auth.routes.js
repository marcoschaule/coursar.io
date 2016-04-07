(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthCtrl     = require('./auth.controller.js');
var CreateRouter = require('../../classes/router.class.js');
var objRoutes    = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the public routes.
 * @type {Object}
 */
objRoutes.public = {
    put: [
        ['/sign-in',
            AuthCtrl.signIn],
        ['/sign-up',
            AuthCtrl.signUp],
        ['/send-verification-email',
            AuthCtrl.sendVerificationEmail],
        ['/verify-email',
            AuthCtrl.verifyEmail],
        ['/forgot-username',
            AuthCtrl.forgotUsername],
        ['/forgot-password',
            AuthCtrl.forgotPassword],
        ['/reset-password',
            AuthCtrl.resetPassword],
        ['/is-available',
            AuthCtrl.isAvailable],
    ],
};

/**
 * Object of the private routes.
 * @type {Object}
 */
objRoutes.private = {
    put: [
        ['/sign-out',    
            AuthCtrl.signOut],
        ['/is-signed-in',
            AuthCtrl.isSignedIn],
    ],
};

/**
 * Array of the authorization functions.
 * @type {Array}
 */
objRoutes.authorize = [
    AuthCtrl.authorize
];

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = CreateRouter(objRoutes);

// *****************************************************************************

})();