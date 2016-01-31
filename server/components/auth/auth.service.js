(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var CryptoJS       = require('crypto-js');
var sha1           = require('crypto-js/sha1');
var jwt            = require('jsonwebtoken');

var Auth           = require('./auth.schema.js').Auth;
var settingsAuth   = require(global.paths.settings.auth);
var settingsErrors = require(global.paths.settings.errors);

// *****************************************************************************
// Service functions
// *****************************************************************************

function signIn(objSignIn, callback) {

    return Auth.findOne({ username: objSignIn.username }, (objErr, objUser) => {
        if (objErr) {
            return callback(objErrors.signIn.generalError);
        }
        if (!objUser) {
            return callback(settingsErrors.signIn.userNotFound);
        }
        // if (!objUser.compare(objSignIn.password)) {
        //     return callback(settingsErrors.signIn.userOrPasswordWrong);
        // }
        return _generateAccessToken(objUser._id.toString(), (strAccessToken) => {
            return callback(null, objUser, strAccessToken);
        });
    });
}

// *****************************************************************************

function isSignedIn() {}

// *****************************************************************************
// Helper functions
// *****************************************************************************

function _generateAccessToken(strUserId, callback) {
    var objInfo    = { userId   : strUserId };
    var objOptions = { algorithm: settingsAuth.accessToken.algorithm };
    var secret     = settingsAuth.accessToken.secret;

    return jwt.sign(objInfo, secret, objOptions, callback);
}

// *****************************************************************************

function _generateRefreshToken() {}

// *****************************************************************************

function _storeRefreshToken() {}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn = signIn;

// *****************************************************************************

})();