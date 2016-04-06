(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var clone = require('clone');
var async = require('async');
var Auth  = require('../auth/auth.schema.js').Auth;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createUser  = createUser;
module.exports.readUser    = readUser;
module.exports.updateUser  = updateUser;
module.exports.deleteUser  = deleteUser;
module.exports.createUsers = createUsers;
module.exports.readUsers   = readUsers;
module.exports.updateUsers = updateUsers;
module.exports.deleteUsers = deleteUsers;

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service function to create a user.
 *
 * @public
 * @param {Object}   objUser   object of the user to be created
 * @param {Function} callback  function for callback
 */
function createUser(objUser, callback) {
    return createUsers([objUser], (objErr, arrUsers) =>
        callback(objErr, arrUsers[0]));
}

// *****************************************************************************

/**
 * Service function to read one user.
 * 
 * @public
 * @param {String}   strUserId  string of the user id from the user to be read
 * @param {Function} callback   function for callback
 */
function readUser(strUserId, callback) {
    return readUsers([strUserId], {}, (objErr, arrUsers) =>
        callback(objErr, arrUsers[0]));
}

// *****************************************************************************

/**
 * Service function to update one user.
 * 
 * @public
 * @param {Object}   objUser   object of the user to be updated
 * @param {Function} callback  function for callback
 */
function updateUser(objUser, callback) {
    return updateUsers([objUser], (objErr, arrUsers) =>
        callback(objErr, arrUsers[0]));
}

// *****************************************************************************

/**
 * Service function to delete one user.
 * 
 * @public
 * @param {String}   strUserId  string of the user id from the user to be deleted
 * @param {Function} callback   function for callback
 */
function deleteUser(strUserId, callback) {
    return deleteUsers([strUserId], (objErr, arrUsers) =>
        callback(objErr, arrUsers[0]));
}

// *****************************************************************************

/**
 * Service function to create multiple users.
 * 
 * @public
 * @param {Array}    arrUsers  array of the users to be created
 * @param {Function} callback  function for callback
 */
function createUsers(arrUsers, callback) {
    var objAuth, arrUsersResult = [];

    if (!arrUsers || arrUsers.length <= 0) {
        console.error(ERRORS.USERS_ADMIN.CREATE_USERS.ARRAY_OF_USERS_EMPTY);
        return callback(ERRORS.USERS_ADMIN.CREATE_USERS.ARRAY_OF_USERS_EMPTY);
    }

    return async.eachSeries(arrUsers, (objUser, _callback) => {
        objUser.password = Auth.encrypt(objUser.passwordNew);
        objAuth          = new Auth(objUser);

        objAuth.save(objErr => {
            if (objErr) {
                console.error(ERRORS.USERS_ADMIN.CREATE_USERS.GENERAL);
                console.error(objErr);
                return _callback(ERRORS.USERS_ADMIN.CREATE_USERS.GENERAL);
            }
            arrUsersResult.push(objAuth);
            return _callback(null);
        });

    // eachSeries callback
    }, objErr => callback(objErr, arrUsersResult));
}

// *****************************************************************************

/**
 * Service function to read multiple users.
 * 
 * @public
 * @param {Array}    arrUserIds    array of the user ids from the users to be read
 * @param {Object}   objModifiers  object of the modifiers like "filter" or "sort"
 * @param {Function} callback      function for callback
 */
function readUsers(arrUserIds, objModifiers, callback) {
    var objFindQuery = {};

    // defaults for "objModifiers"
    objModifiers        = objModifiers        || {};
    objModifiers.select = objModifiers.select || {};
    objModifiers.limit  = objModifiers.limit  || 0;
    objModifiers.sort   = objModifiers.sort   || 'username';

    // remove certain fields from query
    objModifiers.select.__v      = 0;
    objModifiers.select.password = 0;

    // if array of user ids is set, query for these users; otherwise query all
    if (arrUserIds && arrUserIds.length > 0) {
        objFindQuery = { _id: { $in: arrUserIds } };
    }

    return Auth.find(objFindQuery)
        .select(objModifiers.select)
        .limit(objModifiers.limit)
        .sort(objModifiers.sort)
        .exec((objErr, arrUsers) => {
            if (objErr) {
                console.error(ERRORS.USERS_ADMIN.READ_USERS.GENERAL);
                console.error(objErr);
                return callback(ERRORS.USERS_ADMIN.READ_USERS.GENERAL);
            }
            return callback(null, arrUsers);
        });
}

// *****************************************************************************

/**
 * Service function to update multiple users.
 * 
 * @public
 * @param {Array}    arrUsers  array of the users to be updated
 * @param {Function} callback  function for callback
 */
function updateUsers(arrUsers, callback) {
    var arrUserIds = [];
    var strUserId, objPassword;

    if (!arrUsers || arrUsers.length <= 0) {
        console.error(ERRORS.USERS_ADMIN.UPDATE_USERS.ARRAY_OF_USERS_EMPTY);
        return callback(ERRORS.USERS_ADMIN.UPDATE_USERS.ARRAY_OF_USERS_EMPTY);
    }

    return async.eachSeries(arrUsers, (objUser, _callback) => {
        strUserId = objUser._id+'';
        arrUserIds.push(strUserId);
        delete objUser._id;

        // set the password if the admin changed it
        if (objUser.passwordNew) {
            objPassword      = Auth.encrypt(objUser.passwordNew);
            objUser.password = objPassword;
        }

        return Auth.update({ _id: strUserId }, { $set: objUser }, (objErr, objModified) => {
            if (objErr) {
                console.error(ERRORS.USERS_ADMIN.UPDATE_USERS.GENERAL);
                console.error(objErr);
                return _callback(ERRORS.USERS_ADMIN.UPDATE_USERS.GENERAL);
            }
            return _callback(null);
        });

    // eachSeries callback
    }, objErr => {
        if (objErr) {
            return callback(objErr);
        }
        return Auth
            .find({ _id: { $in: arrUserIds }})
            .select({ password: 0, __v: 0 })
            .exec((objErr, arrUsers) => {
                if (objErr) {
                    console.error(ERRORS.USERS_ADMIN.UPDATE_USERS.READ_USERS);
                    console.error(objErr);
                    return callback(ERRORS.USERS_ADMIN.UPDATE_USERS.READ_USERS);
                }
                return callback(null, arrUsers);
            });
    });
}

// *****************************************************************************

/**
 * Service function to delete multiple users.
 * 
 * @public
 * @param {Array}    arrUserIds  array of user ids to be deleted
 * @param {Function} callback    function for callback
 */
function deleteUsers(arrUserIds, callback) {
    if (!arrUserIds || arrUserIds.length <= 0) {
        console.error(ERRORS.USERS_ADMIN.DELETE_USERS.ARRAY_OF_USER_IDS_EMPTY);
        return callback(ERRORS.USERS_ADMIN.DELETE_USERS.ARRAY_OF_USER_IDS_EMPTY);
    }

    return Auth.remove({ _id: { $in: arrUserIds } }, objErr => {
        if (objErr) {
            console.error(ERRORS.USERS_ADMIN.DELETE_USERS.GENERAL);
            console.error(objErr);
            return _callback(ERRORS.USERS_ADMIN.DELETE_USERS.GENERAL);
        }
        return _callback(null);
    });
}

// *****************************************************************************

})();