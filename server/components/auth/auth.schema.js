(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var CryptoJS = require('crypto-js');
var clone    = require('clone');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

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
            country: String,
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

    // states
    state: {
        type: String,
        validate: /active|passive|banned/,
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
var objAuthDeleted     = clone(objAuth);
objAuthDeleted._idOld  = ObjectId;

var schemaAuth        = new Schema(objAuth,        { collection: 'users' });
var schemaUserDeleted = new Schema(objAuthDeleted, { collection: 'usersDeleted' });

// *****************************************************************************
// Virtuals
// *****************************************************************************

/**
 * Virtual getter function to get the user's full name.
 *
 * @private
 */
schemaAuth.virtual('profile.name.full').get(function() {
    var strFull = '';
    strFull += this.profile.name.title  &&
        (this.profile.name.title.trim()  + ' ') || '';
    strFull += this.profile.name.first  &&
        (this.profile.name.first.trim()  + ' ') || '';
    strFull += this.profile.name.middle &&
        (this.profile.name.middle.trim() + ' ') || '';
    strFull += this.profile.name.last   &&
        (this.profile.name.last.trim()   + ' ') || '';
    return strFull.trim();
});

// *****************************************************************************

/**
 * Virtual getter function to get the user's full address.
 *
 * @private
 */
schemaAuth.virtual('profile.address.full').get(function() {
    var strFull = '';
    strFull += this.profile.address.street  &&
        (this.profile.address.street.trim()    + ', ') || '';
    strFull += this.profile.address.zipcode &&
        (this.profile.address.zipcode.trim()   + ' ')  || '';
    strFull += this.profile.address.city    &&
        (this.profile.address.city.trim()      + ' ')  || '';
    strFull += this.profile.address.country &&
        (this.profile.address.country.trim()   + ' ')  || '';
    return strFull.trim();
});

// *****************************************************************************
// Schema methods and statics
// *****************************************************************************

schemaAuth.statics.encrypt = _encrypt;
schemaAuth.methods.encrypt = _encrypt;
schemaAuth.methods.compare = _compare;

// *****************************************************************************
// Options and model definitions
// *****************************************************************************

schemaAuth.set       ('toObject', { getters: true });
schemaAuth.set       ('toJSON',   { getters: true });
schemaUserDeleted.set('toObject', { getters: true });
schemaUserDeleted.set('toJSON',   { getters: true });

var User        = mongoose.model('User',        schemaAuth, 'users');
var UserDeleted = mongoose.model('UserDeleted', schemaAuth, 'usersDeleted');

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

module.exports.Auth              = User;
module.exports.User              = User;
module.exports.UserDeleted       = UserDeleted;
module.exports.schemaAuth        = schemaAuth;
module.exports.schemaUserDeleted = schemaUserDeleted;
module.exports.objAuth           = objAuth;

// ********************************************************************************

})();
