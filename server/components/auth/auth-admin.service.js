(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var Auth   = require('./auth.schema.js').Auth;
var otp    = require('otp');
var base32 = require('rfc-3548-b32');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.checkKey   = checkKey;
module.exports.checkAdmin = checkAdmin;

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service function to check the key send by the user.
 *
 * @public
 * @param {String}   strKeyGiven  string of the user's key that needs to be checked
 * @param {Function} callback     function for callback
 */
function checkKey(strKeyGiven, callback) {
    var strSecret      = base32.encode(new Buffer(settings.authAdmin.otp.secret));
    var objOtp         = otp({ name: settings.authAdmin.otp.name, secret: strSecret });
    var strKeyExpected = objOtp.totp();

    if (strKeyGiven !== strKeyExpected) {
        console.error(ERRORS.AUTH_ADMIN.CHECK_KEY.GIVEN_KEY_DIFFERENT);
        return callback(ERRORS.AUTH_ADMIN.GENERAL);
    }

    return callback(null);
}

// *****************************************************************************

/**
 * Controller function to check if user is admin or not.
 *
 * @public
 * @param {String}   strUsername  string of the user's username or email address
 * @param {Function} callback     function for callback
 */
function checkAdmin(strUsername, callback) {
    var regexUsername = new RegExp('^' + strUsername + '$', 'i');

    return Auth.findOne({ $or: [
            { 'username': regexUsername },
            { 'email'   : regexUsername },
        ] }, (objErr, objUser) => {
        
        if (objErr) {
            console.error(ERRORS.AUTH_ADMIN.CHECK_ADMIN.GENERAL);
            console.error(objErr);
            return callback(ERRORS.AUTH_ADMIN.GENERAL);
        }
        else if (objUser && true === objUser.isAdmin) {
            return callback(null, true);
        }

        console.error(ERRORS.AUTH_ADMIN.CHECK_ADMIN.IS_NO_ADMIN);
        return callback(ERRORS.AUTH_ADMIN.GENERAL, false);
    });
}

// *****************************************************************************

})();