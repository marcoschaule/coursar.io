(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthAdminCtrl = require('./auth-admin.controller.js');
var CreateRouter  = require('../../classes/router.class.js');
var objRoutes     = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the public routes.
 * @type {Object}
 */
objRoutes.public = {
    put: [
        ['/admin/sign-in',     
            AuthAdminCtrl.signIn],
    ],
};

/**
 * Object of the private routes.
 * @type {Object}
 */
objRoutes.private = {
    put: [
        ['/admin/is-signed-in',
            AuthAdminCtrl.isSignedIn],
    ],
};

/**
 * Array of the authorization functions.
 * @type {Array}
 */
objRoutes.authorize = [
    AuthAdminCtrl.authorize
];

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
