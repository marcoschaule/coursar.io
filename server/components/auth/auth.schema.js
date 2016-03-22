(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var CryptoJS = require('crypto-js');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// *****************************************************************************
// Schemata
// *****************************************************************************

/**
 * Schema object for authentication.
 * 
 * @type {Schema}
 */
var objAuth = {

    // user personal data
    profile: {
        name: {
            title: String,
            first: String,
            middle: String,
            last: String,
        },
        dateOfBirth: Date,
        gender: {
            type: String,
            validate: /male|female|other/,
        },
        address: {
            street: String,
            zipcode: String,
            city: String,
            additional: String,
        },
    },

    // user account data
    email: {
        type: String,
        validate: {
            validator: _validateEmail,
            message: settings.errors.common.emailInvalid.message,
        },
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    password: {
        salt: {
            type: String,
            required: true
        },
        hash: {
            type: String,
            required: true
        },
    },

    // time stamps
    firstSignUpAt: {
        type: Date,
        default: null,
    },
    lastSignInAt: {
        type: Date,
        default: null,
    },
    lastResetPasswordAt: {
        type: Date,
        default: null,
    },
    updatedUsernameAt: {
        type: Date,
        default: null,
    },
    updatedEmailAt: {
        type: Date,
        default: null,
    },
    updatedPasswordAt: {
        type: Date,
        default: null,
    },
    

    // flags
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin : {
        type   : Boolean,
        default: false
    },
};
var schemaAuth         = new Schema(objAuth, { collection: 'users' });
var schemaUsersDeleted = new Schema(objAuth, { collection: 'usersDeleted' });

// *****************************************************************************
// Schema methods and statics
// *****************************************************************************

schemaAuth.statics.encrypt = _encrypt;
schemaAuth.methods.encrypt = _encrypt;
schemaAuth.methods.compare = _compare;

// *****************************************************************************
// Model definitions
// *****************************************************************************

var User         = mongoose.model('User',         schemaAuth, 'users');
var UsersDeleted = mongoose.model('UsersDeleted', schemaAuth, 'usersDeleted');

// *****************************************************************************
// Custom validators
// *****************************************************************************

// *****************************************************************************
// Virtuals
// *****************************************************************************

/**
 * Virtual getter function to get the primary email.
 *
 * @private
 */
schemaAuth.virtual('profile.email').get(() => {
    return this.profile && this.profile.emails && this.profile.emails[0];
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to validate a field of the given value object.
 *
 * @private
 * @param  {String}   strField              string of the field name
 * @param  {String}   [strFieldValidation]  (optional) string of the validation field name
 * @return {Function}                       function for validation
 */
function _validateEqual(strField, strFieldValidation) {
    if (!strFieldValidation) {
        strFieldValidation = strField + 'Validation';
    }
    return (objValue) => {
        return (objValue[strField] === objValue[strFieldValidation]);
    };
}

// *****************************************************************************

/**
 * Helper function to validate an email.
 *
 * @private
 * @param  {String}  strEmail  string of email that needs to be validated
 * @return {Boolean}           true if email is valid
 */
function _validateEmail(strEmail) {
   var regexEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return regexEmail.test(strEmail);
}

// *****************************************************************************

/**
 * Helper function to generate the password salt.
 *
 * @private
 * @return {String}  string of the salt to be generated
 */
function _generateSalt() {

    // create the salt string
    var strSalt = CryptoJS.lib.WordArray.random(128/8).toString();

    return strSalt;
}

// *****************************************************************************

/**
 * Helper function to encrypt a password to be saved as a hash with a salt
 * in the database.
 *
 * @private
 * @param  {String} strPassword  string of user password
 * @param  {String} [strSalt]    (optional) string of user generated salt
 * @return {Object}              Object of salt and hash
 */
function _encrypt(strPassword, strSalt) {
    if (!strSalt) {
        strSalt = _generateSalt();
    }

    // create the hash
    var strHash = CryptoJS.PBKDF2(strPassword, strSalt, { keySize: 512/32 }).toString();

    return { salt: strSalt, hash: strHash };
}

// *****************************************************************************

/**
 * Helper function to compare a given password with the stored hash
 * generated from the stored salt.
 *
 * @private
 * @param  {String}  strPassword  string of given password
 * @return {Boolean}              true if both are equal
 */
function _compare(strPassword) {
    /*jshint validthis: true */

    var objPassword = _encrypt(strPassword, this.password.salt);

    // test if password and salt generate the same key
    return (objPassword.hash === this.password.hash);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.Auth               = User;
module.exports.User               = User;
module.exports.UsersDeleted       = UsersDeleted;
module.exports.schemaAuth         = schemaAuth;
module.exports.schemaUsersDeleted = schemaUsersDeleted;
module.exports.objAuth            = objAuth;

// ********************************************************************************

})();
