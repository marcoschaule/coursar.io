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
    var strUserId        = req.session.userId;
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

    return UserService.updateUser(strUserId, objUserUpdate, (objErr, objUser) => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json(objUser);
    });
}

// *****************************************************************************

function deleteUser(req, res, next) {}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createUser = createUser;
module.exports.readUser   = readUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;

// *****************************************************************************

})();
