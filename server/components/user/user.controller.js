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
 * @public
 * 
 * @param {Object}   req   object of Express' default request
 * @param {Object}   res   object of Express' default response
 * @param {Function} next  function of callback for next middleware
 */
function readUser(req, res, next) {
    var strUserId = req.session.userId;
    console.log(">>> Debug ====================; req.headers:", req.headers, '\n\n');

    return UserService.readUser(strUserId, (objErr, objUser) => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json(objUser);
    });
}

// *****************************************************************************

function updateUser(req, res, next) {}

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
