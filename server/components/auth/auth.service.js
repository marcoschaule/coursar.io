(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var async          = require('async');
var jwt            = require('jsonwebtoken');
var uuid           = require('node-uuid');
var Auth           = require('./auth.schema.js').Auth;
var settingsAuth   = require(global.paths.settings.auth);
var settingsErrors = require(global.paths.settings.errors);

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service function to sign user in.
 * 
 * @param  {Object}   objSignIn               object of sign in
 * @param  {String}   objSignIn.username      string of username
 * @param  {String}   objSignIn.password      string of password, still unencrypted
 * @param  {String}   objSignIn.isRemembered  string of password, still unencrypted
 * @param  {Object}   objInfo                 object for additional (user) information
 * @param  {Object}   objInfo.ip              string of the current user's IP address
 * @param  {Function} callback                function for callback
 */
function signIn(objSignIn, objInfo, callback) {
    var objUserReturn;

    return Auth.findOne({ 'profile.username':
            { $regex: objSignIn.username, $options: 'i' } },
            (objErr, objUser) => {
        
        if (objErr) {
            return callback(objErrors.signIn.generalError);
        }
        else if (!objUser) {
            return callback(settingsErrors.signIn.userNotFound);
        }
        else if (!objUser.compare(objSignIn.password)) {
            return callback(settingsErrors.signIn.userOrPasswordWrong);
        }

        var strUserId = objUser._id.toString();

        return _generateRedisSession(strUserId, (objErr, strToken) => {
            if (objErr) {
                return callback(objErrors.signIn.generalError);
            }

            return _generateAccessToken(strUserId, strToken, (strAccessToken) => {
                return callback(null, objUser.profile, strAccessToken);
            });
        });

    });
}

// *****************************************************************************

/**
 * Service function to sign user up.
 * 
 * @param  {Object}   objSignUp           object of sign up
 * @param  {String}   objSignUp.username  string of username
 * @param  {String}   objSignUp.password  string of password, still unencrypted
 * @param  {String}   objSignUp.email     string of email, still unvalidated
 * @param  {Function} callback            function for callback
 */
function signUp(objSignUp, callback) {
    var objPassword = Auth.encrypt(objSignUp.password);
    var objUserReturn;

    return Auth.findOne({ $or: [
            { 'profile.username': { $regex: objSignUp.username, $options: 'i' } },
            { 'profile.emails': { $elemMatch: { address: { $regex: objSignUp.email, $options: 'i' } } } },
    ] }, (objErr, objUser) => {
        if (objErr) {
            return callback(objErrors.signUp.generalError);
        }
        else if (objUser && objUser.profile && objUser.profile.username === objSignUp.username) {
            return callback(settingsErrors.signUp.usernameNotAvailable);
        }
        else if (objUser && objUser.profile && _indexOfEmailInArray(objUser.profile.emails, objSignUp.email) >= 0) {
            return callback(settingsErrors.signUp.emailNotAvailable);
        }

        var objAuth = new Auth({
            profile: {
                username: objSignUp.username,
                emails  : [{
                    address : objSignUp.email,
                    verified: false,
                }],
            },
            private: {
                password: {
                    hash: objPassword.hash,
                    salt: objPassword.salt,
                },
            },
        });

        return objAuth.save((objErr) => {
            if (objErr) {
                return callback(objErrors.signUp.generalError);
            }
            return callback(null, objSignUp);
        });
    });
}

// *****************************************************************************

/**
 * Service function to set a given email to be the main email.
 * Either the email already exists within the "profile.emails" array,
 * then it is moved to position 0. Or it doesn't exist, then it is
 * just inserted at position 0.
 * 
 * @param {String}   strUserId    string of user id
 * @param {String}   strEmailNew  string of new or existing email address
 * @param {Function} callback     function for callback
 */
function setEmail(strUserId, strEmailNew, callback) {
    var objEmailNew = { address: strEmailNew, isValidated: false };
    var isValidated = false;
    var numPosition = -1;

    return Auth.findOne({ _id: strUserId }, (objErr, objUser) => {
        if (objErr || !objUser || !objUser.profile || !objUser.profile.emails) {
            return callback(true);
        }

        // Check existing emails, if given email is already saved.
        // If yes, use field "isValidated" for re-ordering the emails.
        numPosition = _indexOfEmailInArray(objUser.profile.emails, strEmailNew);
        objEmailNew = objUser.profile.emails[numPosition];

        return async.series([

            // remove email from array if available
            (_callback) => {
                if (numPosition < 0) {
                    return _callback(null);
                }

                return Auth.update({ _id: strUserId }, { $pull: 
                        { 'profile.emails': { _id: objEmailNew._id } } },
                        _callback);
            },

            // add email to position 0
            (_callback) => {
                return Auth.update({ _id: strUserId }, { $push:
                        { 'profile.emails': { $each: [objEmailNew], $position: 0 } } },
                        _callback);
            },

        // async callback
        ], callback);
    });


}

// *****************************************************************************

function isSignedIn() {}
function isUsernameAvailable() {}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to get the index of a given array,
 * if it appears in the given array of emails.
 * 
 * @param  {Array}  arrEmails  array of emails
 * @param  {String} strEmail   string of email
 * @return {Number}            number of index
 */
function _indexOfEmailInArray(arrEmails, strEmail) {
    for (var i = 0; i < arrEmails.length; i += 1) {
        if (arrEmails[i].address === strEmail) {
            return i;
        }
    }

    return -1;
}

// *****************************************************************************

/**
 * Helper function to generate the redis session if it doesn't exist, yet.
 * 
 * @param  {String}   strUserId  string of user id
 * @param  {Function} callback   function for callback
 */
function _generateRedisSession(strUserId, callback) {
    var objTokens = {};

    return async.parallel([
        
        // generate the access token
        _callback => {
            _generateAccessToken(strUserId, strToken => {
                objTokens.accessToken = strToken;
            });
        },
        
        // generate the refresh token
        _callback => {
            _generateRefreshToken(strUserId, strToken => {
                objTokens.refreshToken = strToken;
            });
        },
    
    ], objErr => {
        if (objErr) {
            return callback(objErr);
        }

        return global.redisSession.create({
            app: global.appName,
            id : strUserId,
            ttl: 3600,
            d: { 
                userId      : strUserId,
                accessToken : objTokens.accessToken,
                refreshToken: objTokens.refreshToken,
            }
        }, (objErr, objResult) => {
            callback(objErr, objResult && objResult.token);
        });
    });
}

// *****************************************************************************

/**
 * Helper function to generate an access token.
 * 
 * @param  {String}   strUserId  string of the user id in the MongoDB database
 * @param  {Function} callback   function for callback
 */
function _generateAccessToken(strUserId, callback) {
    var objInfo    = { userId   : strUserId };
    var objOptions = { algorithm: settingsAuth.accessToken.algorithm };
    var strSecret  = settingsAuth.accessToken.secret;

    return jwt.sign(objInfo, strSecret, objOptions, callback);
}

// *****************************************************************************

function _generateRefreshToken(strUserId, callback) {
    var objInfo    = { userId   : strUserId };
    var objOptions = { algorithm: settingsAuth.refreshToken.algorithm };
    var strSecret  = settingsAuth.refreshToken.secret;

    return jwt.sign(objInfo, strSecret, objOptions, callback);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn   = signIn;
module.exports.signUp   = signUp;
module.exports.setEmail = setEmail;

// *****************************************************************************

})();