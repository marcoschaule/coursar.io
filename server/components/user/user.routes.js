(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var UserCtrl     = require('./user.controller.js');
var CreateRouter = require(paths.core.appendPath('router.class.js'));
var objRoutes    = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the private routes.
 * @type {Object}
 */
objRoutes.private = {
    put: [
        ['/user/create',
            UserCtrl.createUser],
        ['/user/read',
            UserCtrl.readUser],
        ['/user/update',
            UserCtrl.updateUser],
        ['/user/delete',
            UserCtrl.deleteUser],
        ['/user/update-password',
            UserCtrl.updatePassword],
    ],
};

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
