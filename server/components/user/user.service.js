(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var async          = require('async');
var clone          = require('clone');
var moment         = require('moment');
var UserRessources = require('../auth/auth.schema.js');
var AuthService    = require('../auth/auth.service.js');
var libDate        = require('../../libs/date.lib.js');
var User           = UserRessources.User;
var UserDeleted    = UserRessources.UserDeleted;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readUser       = readUser;
module.exports.updateUser     = updateUser;
module.exports.updatePassword = updatePassword;
module.exports.deleteUser     = deleteUser;

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service method to get the "public" user data.
 * 
 * @public
 * @param {String}   strUserId  string of request user's id
 * @param {Function} callback   function for callback
 */
function readUser(strUserId, callback) {
    var objUserResult;

    return User.findOne({ _id: strUserId }, (objErr, objUser) => {
        if (objErr) {
            return callback(objErr);
        }
        if (!objUser || !objUser._id || !objUser.username || !objUser.email) {
            return callback({ err: { message: 'User not found!' } });
        }

        objUserResult = {
            profile            : JSON.parse(JSON.stringify(objUser.profile)),
            username           : objUser.username,
            email              : objUser.email,
            isVerified         : objUser.isVerified,
            firstSignUpAt      : objUser.firstSignUpAt,
            lastSignInAt       : objUser.lastSignInAt,
            lastResetPasswordAt: objUser.lastResetPasswordAt,
            updatedUsernameAt  : objUser.updatedUsernameAt,
            updatedEmailAt     : objUser.updatedEmailAt,
            updatedPasswordAt  : objUser.updatedPasswordAt,
        };

        // parse date into readable value
        if (objUser.profile && objUser.profile.dateOfBirth) {
            objUserResult.profile.dateOfBirth =
                moment(objUser.profile.dateOfBirth).format('MM/DD/YYYY');
        }

        return callback(null, objUserResult);
    });
    
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }
}

// *****************************************************************************

/**
 * Service function to update user data and get the updated user.
 * This function calls the "readUser" function if successful.
 *
 * @public
 * @param {Object}   objSession     object of the users session
 * @param {Object}   objUserUpdate  object of the user data to be updated
 * @param {Function} callback       function for callback
 */
function updateUser(objSession, objUserUpdate, callback) {
    var strUserId = objSession.userId;
    var arrSeries = [];
    var isDateValid;

    // if date of birth is given, try to convert it to a valid date
    if (objUserUpdate.profile && objUserUpdate.profile.dateOfBirth) {
        if (!libDate.testDateOfBirth(objUserUpdate.profile.dateOfBirth)) {
            return callback('Invalid date!');
        }
        objUserUpdate.profile.dateOfBirth = Date.parse(objUserUpdate.profile.dateOfBirth);
    }

    // if necessary, test if username is available
    if (objUserUpdate.username) {
        arrSeries.push(_callback => AuthService.isUsernameAvailable(
                objUserUpdate.username, _callback));
        arrSeries.push(_callback => User.update(
                { _id : strUserId },
                { $set: { updatedUsernameAt: new Date() } },
                _callback)
        );
        arrSeries.push(_callback => {
            objSession.username = objUserUpdate.username;
            return AuthService.updateSession(objSession, _callback);
        });
    }
    
    // if necessary, test if email is available
    if (objUserUpdate.email) {
        arrSeries.push(_callback => AuthService.isEmailAvailable(
                objUserUpdate.email, _callback));
        arrSeries.push(_callback => User.update(
                { _id : strUserId },
                { $set: { updatedEmailAt: new Date() } },
                _callback)
        );
        arrSeries.push(_callback => {
            objSession.email = objUserUpdate.email;
            return AuthService.updateSession(objSession, _callback);
        });
    }

    // add user update step
    arrSeries.push((_callback) => User.update(
            { _id: strUserId },
            { $set: objUserUpdate },
            (objErr, objModified) => _callback(objErr)));

    return async.series(arrSeries, objErr => {
        if (objErr) {
            console.error(objErr);
            return callback(objErr);
        }
        return readUser(strUserId, callback);
    });
}

// *****************************************************************************

/**
 * Service function to delete the user's account.
 *
 * @public
 * @param {Object}   objSession   object of the session to be deleted
 * @param {String}   strPassword  string of the user's password
 * @param {Function} callback     function for callback
 */
function deleteUser(objSession, strPassword, callback) {
    var strUserId   = objSession.userId;
    var objPassword = User.encrypt(strPassword);
    var userDeleted;

    return async.waterfall([

        // test password
        (_callback) => {

            return User.findOne({ _id: strUserId }, (objErr, objUser) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback({ err: settings.errors.signIn.generalError });
                }
                else if (!objUser || !objUser.compare(strPassword)) {
                    console.error(settings.errors.signIn.usernameOrPasswordWrong);
                    return _callback({ err: settings.errors.signIn.usernameOrPasswordWrong, redirect: true });
                }
                return _callback(null, objUser);
            });
        },

        // copy user into "usersDeleted" database
        (objUser, _callback) => {

            // create new user object
            userDeleted = new UserDeleted(objUser);

            // save the new copy into deleted database
            return userDeleted.save(objErr => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                return _callback(null);
            });
        },

        // delete user in "users" database
        (_callback) => {
            return User.remove({ _id: strUserId }, objErr => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                return _callback(null);
            });
        },

        // delete session
        (_callback) => {
            return AuthService.deleteAllSessions(strUserId, objErr => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                return _callback(null);
            });
        },

    // waterfall callback
    ], objErr => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, { redirect: true });
    });
}

// *****************************************************************************

/**
 * Service function to update the user's password.
 *
 * @public
 * @param {String}   strUserId                    current user's id
 * @param {Object}   objPassword                  object of the passwords
 * @param {String}   objPassword.passwordCurrent  string of the user's current password
 * @param {String}   objPassword.passwordNew      string of the user's new password
 * @param {Function} callback                     function for callback
 */
function updatePassword(strUserId, objPassword, callback) {
    var objPasswordNew = User.encrypt(objPassword.passwordNew);

    return async.waterfall([
    
        // find the user and test the password
        (_callback) => {
            return User.findOne({ _id: strUserId }, (objErr, objUser) => {
                
                if (objErr) {
                    console.error(objErr);
                    return _callback({ err: settings.errors.signIn.generalError });
                }
                else if (!objUser || !objUser.compare(objPassword.passwordCurrent)) {
                    console.error({ err: { message: 'Password incorrect!'}, disableRepeater: true });
                    return _callback({ err: { message: 'Password incorrect!'}, disableRepeater: true });
                }
                return _callback(null);
            });
        },

        // save the new password
        (_callback) => {
            return User.update(
                    { _id: strUserId },
                    { $set: {
                        'password.salt'    : objPasswordNew.salt,
                        'password.hash'    : objPasswordNew.hash,
                        'updatedPasswordAt': new Date(),
                    } },
                    (objErr, objModified) => {
               
                if (objErr) {
                   console.error(objErr);
                   return _callback({ err: settings.errors.resetPassword.generalError });
                }
                return _callback(null);
            });
        },
    ], callback);
}

// *****************************************************************************

})();
