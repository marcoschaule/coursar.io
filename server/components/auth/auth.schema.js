(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var CryptoJS = require('crypto-js');
var sha1     = require('crypto-js/sha1');
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
    profile            : {
        name           : {
            first      : { type: String },
            last       : { type: String },
        },
        address        : {
            street     : { type: String },
            city       : { type: String },
            postalCode : { type: String },
        },
        dateOfBitrh    : { type: Date },
    },
    emails         : [{
        address    : { type: String },
        isValidated: { type: Boolean, default: false },
    }],    
    username           : { type: String, required: true },
    password           : {
        salt           : { type: String, required: true },
        hash           : { type: String, required: true },
    },
    isAdmin            : { type: Boolean, default: false },
};
var schemaAuth = new Schema(objAuth, { collection: 'users' });

// *****************************************************************************

/**
 * schema object for sign in.
 * 
 * @type {Schema}
 */
var objSignIn = {
    username          : { type: String, required: true },
    password          : { type: String, required: true },
};
var schemaSignIn = new Schema(objSignIn);

// *****************************************************************************

/**
 * Schema object for sign up.
 * 
 * @type {Schema}
 */
var objSignUp = {
    username          : { type: String, required: true },
    email             : { type: String, required: true },
    emailValidation   : { type: String, required: true, validation: _validateEqual('email') },
    password          : { type: String, required: true },
    passwordValidation: { type: String, required: true, validation: _validateEqual('password') },
};
var schemaSignUp = new Schema(objSignUp, {
    toObject: { virtuals: true },
    toJSON:   { virtuals: true }
});

// *****************************************************************************
// Schema methods and statics
// *****************************************************************************

schemaAuth.statics.encrypt = _encrypt;
schemaAuth.methods.encrypt = _encrypt;
schemaAuth.methods.compare = _compare;

// *****************************************************************************
// Virtuals
// *****************************************************************************

/**
 * Virtual getter function to get the primary email.
 */
schemaAuth.virtual('profile.email').get(() => {
    return this.profile && this.profile.emails && this.profile.emails[0];
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to generate the exports object
 * 
 * @return {Object}  object of all exports
 */
function _getExports() {
    var Auth = mongoose.model('Auth', schemaAuth, 'users');

    var objExports = {
        Auth        : Auth,
        schemaAuth  : schemaAuth,
        schemaSignIn: schemaSignIn,
        schemaSignUp: schemaSignUp,
        objAuth     : objAuth,
        objSignIn   : objSignIn,
        objSignUp   : objSignUp,
    };

    return objExports;
}

// *****************************************************************************

/**
 * Helper function to validate a field of the given value object.
 * 
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
 * Helper function to encrypt a password to be saved as a hash with a salt
 * in the database.
 * 
 * @param  {String} strPassword  string of user password
 * @return {Object}              Object of salt and hash
 */
function _encrypt(strPassword) {

    // create the salt string
    var strSalt = CryptoJS.lib.WordArray.random(128/8);

    // create the hash
    var strHash = CryptoJS.PBKDF2(strPassword, strSalt, { keySize: 512/32 }).toString();

    return { salt: strSalt, hash: strHash };
}

// *****************************************************************************

/**
 * Helper function to compare a given password with the stored hash
 * generated from the stored salt.
 * 
 * @param  {String}  strPassword  string of given password
 * @param  {String}  strSalt      string of stored salt
 * @param  {String}  strHash      string of stored hash
 * @return {Boolean}              true if both are equal
 */
function _compare(strPassword) {
    /*jshint validthis: true */

    // test if password and salt generate the same key
    return (this.password.hash === CryptoJS.PBKDF2(strPassword, this.password.salt, { keySize: 512/32 })).toString();
}

// *****************************************************************************
// Export
// *****************************************************************************

module.exports = _getExports();

// ********************************************************************************

})();
