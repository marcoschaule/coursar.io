(function() { 'use strict';

// *****************************************************************************
// Requires and definitions
// *****************************************************************************

var UserService = require('./user.service.js');

// *****************************************************************************
// Controller functions
// *****************************************************************************

function createUser(req, res, next) {}

// *****************************************************************************

/**
 * Controller function to get the "public" user data.
 * 
 * @public
 * @param {Object}   req   object of Express' default request
 * @param {Object}   res   object of Express' default response
 * @param {Function} next  function of callback for next middleware
 */
function readUser(req, res, next) {
    var strUserId = req.session.userId;

    return UserService.readUser(strUserId, (objErr, objUser) => {
        if (objErr) {
            console.error(objErr);
            return next(objErr);
        }
        return res.status(200).json(objUser);
    });
}

// *****************************************************************************

/**
 * Controller function to update the user data.
 *
 * @public
 * @param {Object}   req            object of Express' default request
 * @param {Object}   req.body       object of the request body
 * @param {Object}   req.body.user  object of the user the user to be updated
 * @param {Object}   req.session    object of the request session
 * @param {Object}   res            object of Express' default response
 * @param {Function} next           function of callback for next middleware
 */
function updateUser(req, res, next) {
    var objUserUpdate    = req.body.user;
    var objUserUpdateNew = {};

    if (objUserUpdate.username && objUserUpdate.username !== req.session.username) {
        objUserUpdateNew.username = objUserUpdate.username;
    }
    if (objUserUpdate.email && objUserUpdate.email !== req.session.email) {
        objUserUpdateNew.email = objUserUpdate.email;
    }
    if (objUserUpdate.profile) {
        objUserUpdateNew.profile = objUserUpdate.profile;
    }

    return UserService.updateUser(req.session, objUserUpdateNew, (objErr, objUser) => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json(objUser);
    });
}

// *****************************************************************************

/**
 * Controller function to delete the user's account.
 * 
 * @public
 * @param {Object}   req                object of Express' default request
 * @param {Object}   req.body           object of the request body
 * @param {String}   req.body.password  string of the user's current password
 * @param {Object}   req.session        object of the request session
 * @param {Object}   res                object of Express' default response
 * @param {Function} next               function of callback for next middleware
 */
function deleteUser(req, res, next) {
    var strUserId   = req.session.userId;
    var strPassword = req.body.password;

    if (!strUserId || !strPassword) {
        return next({ err: 'An unexpected error occurred!' });
    }

    return UserService.deleteUser(req.session, strPassword, objErr => {
        if (objErr) {
            return next(objErr);
        }
        res.set('X-Access-Token', 'delete');
        return res.status(201).json({ success: true, redirect: true });
    });
}

// *****************************************************************************

/**
 * Controller function to update the user's password.
 *
 * @public
 * @param {Object}   req                                 object of Express' default request
 * @param {Object}   req.body                            object of the request body
 * @param {Object}   req.body.passwords                  object of the the passwords
 * @param {String}   req.body.passwords.passwordNew      string of the new password
 * @param {String}   req.body.passwords.passwordCurrent  string of the current password
 * @param {Object}   req.session                         object of the request session
 * @param {Object}   res                                 object of Express' default response
 * @param {Function} next                                function of callback for next middleware
 */
function updatePassword(req, res, next) {
    var strUserId   = req.session.userId;
    var objPassword = req.body.passwords;

    if (!objPassword.passwordCurrent) {
        return next({ err: { message: 'Current password not send!'}, disableRepeater: true });
    }
    if (!objPassword.passwordNew) {
        return next({ err: { message: 'New password not send!'}, disableRepeater: true });
    }

    return UserService.updatePassword(strUserId, objPassword, objErr => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(201).json({ success: true });
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createUser     = createUser;
module.exports.readUser       = readUser;
module.exports.updateUser     = updateUser;
module.exports.deleteUser     = deleteUser;
module.exports.updatePassword = updatePassword;

// *****************************************************************************

})();
