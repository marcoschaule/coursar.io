(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var mongoose       = require('mongoose');
var uuid           = require('uuid');
var clone          = require('clone');
var async          = require('async');
var AuthRessources = require('./auth.schema.js');

//libraries
var libEmail       = require('../../libs/email.lib.js');
var libRedis       = require('../../libs/redis.lib.js');

// Models
var Auth           = AuthRessources.Auth;
var SignUp         = AuthRessources.SignUp;

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service function to sign user in.
 *
 * @public
 * @param  {Object}   objSignIn               object of sign in
 * @param  {String}   objSignIn.username      string of username
 * @param  {String}   objSignIn.password      string of password, still unencrypted
 * @param  {String}   objSignIn.isRemembered  string of password, still unencrypted
 * @param  {Object}   objInfo                 object for additional (user) information
 * @param  {Object}   objInfo.ip              string of the current user's IP address
 * @param  {Object}   objSession              object of request session object
 * @param  {Function} callback                function for callback
 */
function signIn(objSignIn, objInfo, objSession, callback) {
    var regexUsername = new RegExp('^' + objSignIn.username + '$', 'i');
    var objUserReturn = {};
    var objErrorReturn, strUserId;

    return async.waterfall([

        // find user by username or email and compare password
        (_callback) => {

            return Auth.findOne({ $or: [
                    { 'username': regexUsername },
                    { 'email'   : regexUsername },
                ] }, (objErr, objUser) => {
                
                if (objErr) {
                    console.error(objErr);
                    return _callback({ err: settings.errors.signIn.generalError });
                }
                else if (!objUser || !objUser.compare(objSignIn.password)) {
                    console.error(settings.errors.signIn.usernameOrPasswordWrong);
                    return _callback({ err: settings.errors.signIn.usernameOrPasswordWrong, redirect: true });
                }
                return _callback(null, objUser);
            });
        },

        // setup session data
        (objUser, _callback) => {

            // get MongoDB user id
            strUserId = objUser._id.toString();

            // this will be stored in redis
            objSession.userId       = strUserId;
            objSession.username     = objUser.username;
            objSession.email        = objUser.email;
            objSession.createdAt    = Date.now();
            objSession.updatedAt    = Date.now();
            objSession.sessionAge   = settings.auth.session.sessionAge;
            objSession.isRemembered = objSignIn.isRemembered;
            objSession.ua           = objInfo.ua;
            objSession.ip           = objInfo.ip;
            objSession.ipo          = null;
            objSession.isSignedIn   = true;

            return _callback(null, objUser);
        },

        // generate session
        (objUser, _callback) => {

            return _generateSession(objSession, (objErr, strToken) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }

                // this will be send back to the user
                objUserReturn._id       = strUserId;
                objUserReturn.username  = objUser.username;

                return _callback(null, objUserReturn, strToken);
            });
        },

    ], callback);
}

// *****************************************************************************

/**
 * Service function to sign user up.
 *
 * @public
 * @param  {Object}   objSignUp           object of sign up
 * @param  {String}   objSignUp.username  string of username
 * @param  {String}   objSignUp.password  string of password, still unencrypted
 * @param  {String}   objSignUp.email     string of email, still unvalidated
 * @param  {Function} callback            function for callback
 */
function signUp(objSignUp, callback) {
    var objPassword, objUserReturn, docUser, objErrValidation;

    // waterfall for sign up
    return async.waterfall([
    
        // test if user or email already exists and proceed if not
        (_callback) => {

            return Auth.findOne({ $or: [
                { 'username': { $regex: objSignUp.username, $options: 'i' } },
                { 'email'   : { $regex: objSignUp.email,    $options: 'i' } },
            ] }, (objErr, objUser) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.signUp.generalError);
                }
                else if (objUser && objUser.profile && objUser.profile.username === objSignUp.username) {
                    console.error(settings.errors.signUp.usernameNotAvailable);
                    return _callback(settings.errors.signUp.generalError);
                }
                else if (objUser && objUser.profile && objSignUp.email) {
                    console.error(settings.errors.signUp.emailNotAvailable);
                    return _callback(settings.errors.signUp.generalError);
                }
                return _callback(null);
            });
        },

        // create the user object and save it in the database
        (_callback) => {

            // encrypt password
            objPassword = Auth.encrypt(objSignUp.password);

            // create a new authenticated user
            var objUser = new Auth({
                username: objSignUp.username,
                email   : objSignUp.email,
                password: {
                    hash: objPassword.hash,
                    salt: objPassword.salt,
                },
            });

            return objUser.save(objErr => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.signUp.generalError);
                }
                return _callback(null, objUser._id.toString());
            });
        },

        // send verification email to the user
        sendVerificationEmail,

    ], callback);
}

// *****************************************************************************

/**
 * Service function to sign out. It destroys the session in redis
 * and the JWToken.
 *
 * @public
 * @param {Object}   objSession  object of session
 * @param {Function} callback    function for callback
 */
function signOut(objSession, callback) {
    return objSession.destroy(objErr => callback(null));
}

// *****************************************************************************

/**
 * Service function to send the verification email.
 *
 * @public
 * @param {String}   objSession  object
 * @param {Function} callback   function for callback
 */
function sendVerificationEmail(objSession, callback) {
    var strUserId = objSession.userId;

    if (!objSession || !objSession.userId || !objSession.email) {
        return callback(objErrs.common.sessionMissing);
    }

    return async.waterfall([

        // set the Redis entry and receive the Redis ID
        (_callback) => {

            return libRedis.setRedisEntryForEmailVerification(strUserId, (objErr, strRId) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.sendVerificationEmail.generalError);
                }
                return _callback(null, strRId);
            });
        },

        // send the email address validation email to the user
        (strRId, _callback) => {

            return libEmail.sendEmailVerifyEmail(objSession.email, strRId, (objErr, objResult) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.sendVerificationEmail.generalError);
                }
                return _callback(null);
            });
        },

    ], callback);
}

// *****************************************************************************

/**
 * Service function to verify the user's email.
 *
 * @public
 * @param {String}   strRId    string of the Redis entry ID
 * @param {Function} callback  function for callback
 */
function verifyEmail(strRId, callback) {
    var strUserId;

    return async.waterfall([
    
        // get user id from Redis entry by key to test if email fits
        (_callback) => {

            return libRedis.getRedisEntry(strRId, (objErr, objEntry) => {
                if (objErr && objErr.disableRepeater) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                else if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.verifyEmail.generalError);
                }
                return _callback(null, objEntry.userId);
            });
        },

        // verify user from database by user id AND email
        (strUserId, _callback) => {

            return Auth.update({ _id: strUserId },
                    { $set: { isVerified: true } },
                    (objErr, objUser) => {

                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.verifyEmail.generalError);
                }
                return _callback(null);
            });
        },

        // delete Redis entry by key
        (_callback) => {

            return libRedis.deleteRedisEntry(strRId, _callback);
        },

    ], callback);
}

// *****************************************************************************

/**
 * Service function to handle a "forgot password" request. This function sends
 * an email to the user including a link to reset the password.
 * 
 * @public
 * @param {String}   strEmail  string of email the link should be send to
 * @param {Function} callback  function for callback
 */
function forgotUsername(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');

    if (!callback || 'function' !== typeof callback) {
        console.error(settings.errors.common.callbackMissing);
        callback = function() {};
    }

    return async.waterfall([
        
        // get the user ID from the email
        (_callback) => {

            return Auth.findOne({ 'email': regexEmail }, (objErr, objUser) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                else if (!objUser || !objUser.username) {
                    console.error('No such email found!');
                    return _callback('No such email found!');
                }
                return _callback(null, objUser.username);
            });
        },

        // send the email to the given email address
        (strUsername, _callback) => {

            return libEmail.sendEmailForgotUsername(strEmail, strUsername, (objErr, objResult) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.resetPassword.generalError);
                }
                return _callback(null);
            });
        },
    
    // async waterfall callback
    ], callback);
}

// *****************************************************************************

/**
 * Service function to handle a "forgot password" request. This function sends
 * an email to the user including a link to reset the password.
 * 
 * @public
 * @param {String}   strEmail  string of email the link should be send to
 * @param {Function} callback  function for callback
 */
function forgotPassword(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');
    var objMailOptions, strLink, regexLink;

    if (!callback || 'function' !== typeof callback) {
        console.error(settings.errors.common.callbackMissing);
        callback = function() {};
    }

    return async.waterfall([
        
        // get the user ID from the email
        (_callback) => {

            return Auth.findOne({ 'email': regexEmail }, (objErr, objUser) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(objErr);
                }
                else if (!objUser || !objUser._id) {
                    console.error('No such email found!');
                    return _callback('No such email found!');
                }
                return _callback(null, objUser._id.toString());
            });
        },

        // set the Redis entry and receive the Redis ID
        (strUserId, _callback) => {

            return libRedis.setRedisEntryForPasswordReset(strUserId, (objErr, strRId) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.resetPassword.generalError);
                }
                return _callback(null, strRId);
            });
        },

        // send the email to the given email address
        (strRId, _callback) => {

            return libEmail.sendEmailForgotPassword(strEmail, strRId, (objErr, objResult) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.resetPassword.generalError);
                }
                return _callback(null);
            });
        },
    
    // async waterfall callback
    ], callback);
}

// *****************************************************************************

/**
 * Service function to reset the password, depending on the Redis ID send
 * from the user.
 *
 * @public
 * @param {String}   strRId          string of Redis ID
 * @param {String}   strPasswordNew  string of new password
 * @param {Function} callback        function for callback
 */
function resetPassword(strRId, strPasswordNew, callback) {
    var strKey = 'resp:' + strRId;
    var objPassword;

    if (!callback || 'function' !== typeof callback) {
        console.error(settings.errors.common.callbackMissing);
        callback = function() {};
    }

    // generate hash and salt for the new password
    objPassword = Auth.encrypt(strPasswordNew);

    return async.waterfall([
    
        // get Redis entry to get the MongoDB user ID
        (_callback) => {

            return libRedis.getRedisEntry(strKey, (objErr, objReply) => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.resetPassword.generalError);
                }
                if (!objReply || !objReply.userId) {
                    console.error('Redis entry does not exist anymore!');
                    return _callback(settings.errors.resetPassword.sessionExpired);
                }
                return _callback(null, objReply.userId.toString());
            });
        },

        // update password in database
        (strUserId, _callback) => {

            return Auth.update(
                    { _id: strUserId },
                    { $set: { 'password.salt': objPassword.salt, 'password.hash': objPassword.hash } },
                    (objErr, objModified) => {
               
                if (objErr) {
                   console.error(objErr);
                   return _callback(settings.errors.resetPassword.generalError);
                }
                return _callback(null);
            });
        },

        // delete Redis entry with MongoDB user ID
        (_callback) => {

            return libRedis.deleteRedisEntry(strKey, objErr => {
                if (objErr) {
                    console.error(objErr);
                    return _callback(settings.errors.resetPassword.generalError);
                }
                return _callback(null);
            });
        },

    // async waterfall callback
    ], callback);
}

// *****************************************************************************

/**
 * Service function to set a given email to be the main email.
 * Either the email already exists within the "emails" array,
 * then it is moved to position 0. Or it doesn't exist, then it is
 * just inserted at position 0.
 *
 * @public
 * @param {String}   strUserId    string of user id
 * @param {String}   strEmailNew  string of new or existing email address
 * @param {Function} callback     function for callback
 */
function setEmail(strUserId, strEmailNew, callback) {
    var objEmailNew = { address: strEmailNew, isValidated: false };
    var isValidated = false;
    var numPosition = -1;

    return Auth.findOne({ _id: strUserId }, (objErr, objUser) => {
        if (objErr || !objUser || !objUser.profile || !objUser.email) {
            return callback(true);
        }

        // Check existing emails, if given email is already saved.
        // If yes, use field "isValidated" for re-ordering the emails.
        numPosition = _indexOfEmailInArray(objUser.emails, strEmailNew);
        objEmailNew = objUser.emails[numPosition];

        return async.series([

            // remove email from array if available
            (_callback) => {

                if (numPosition < 0) {
                    return _callback(null);
                }

                return Auth.update({ _id: strUserId }, { $pull: 
                        { 'emails': { _id: objEmailNew._id } } },
                        _callback);
            },

            // add email to position 0
            (_callback) => {

                return Auth.update({ _id: strUserId }, { $push:
                        { 'emails': { $each: [objEmailNew], $position: 0 } } },
                        _callback);
            },

        // async series callback
        ], callback);
    });
}

// *****************************************************************************

/**
 * Service function to check whether a user is still signed in or not.
 * This function also checks if the max life time of the session is over
 * or not.
 *
 * If the user didn't want to be remembered, the session lives for the maximum
 * of one hour (according to the settings). If the user interacts with the app
 * during that time, the session is refreshed for each interaction. If not, the
 * session is deleted.
 *
 * If the user wanted to be remembered, the session lives for the maximum of
 * one week (according to the settings). During that week, the session does not
 * need to be refreshed, unless it is one hour before the end. If the user
 * interact with the app one hour before the long session ends, the session will
 * be refreshed for one additional hour for each interaction. If not, the
 * session is deleted.
 *
 * @public
 * @param {Object}   objSession  object of the user's session
 * @param {Function} callback    function for callback
 */
function checkSignedIn(objSession, callback) {
    var _isSignedIn      = isSignedIn(objSession);
    var objIsNotSignedIn = { isSignedIn: false };

    // if user is not signed in (anymore), return that info
    if (!_isSignedIn) {
        return callback(objIsNotSignedIn);
    }
    // test if session is older than "sessionAge" or "maxAge" plus "sessionAge"
    var isSessionOlderThanSessionAge = 
        objSession.updatedAt + settings.auth.session.sessionAge * 1000 < Date.now();
    var isSessionOlderThanMaxAge =
        objSession.createdAt + settings.auth.session.maxAge * 1000 < Date.now();
    var isSessionNotRememberedAndOlderThanSessionAge =
        !objSession.isRemembered &&
        isSessionOlderThanSessionAge;
    var isSessionRememberedAndOlderThanMaxAge =
        !!objSession.isRemembered &&
        isSessionOlderThanMaxAge &&
        isSessionOlderThanSessionAge;

    // console.log(">>> Debug ====================; objSession.isRemembered:", objSession.isRemembered);
    // console.log(">>> Debug ====================; isSessionOlderThanSessionAge:", isSessionOlderThanSessionAge);
    // console.log(">>> Debug ====================; isSessionOlderThanMaxAge:", isSessionOlderThanMaxAge);
    // console.log(">>> Debug ====================; isSessionNotRememberedAndOlderThanSessionAge:", isSessionNotRememberedAndOlderThanSessionAge);
    // console.log(">>> Debug ====================; isSessionRememberedAndOlderThanMaxAge:", isSessionRememberedAndOlderThanMaxAge, '\n\n');

    // set a new "updatedAt" date
    objSession.updatedAt = Date.now();

    // if session is not remembered and older than "sessionAge", destroy it
    // or if session is remembered but older than "maxAge" and "sessionage"
    if (isSessionNotRememberedAndOlderThanSessionAge ||
            isSessionRememberedAndOlderThanMaxAge) {
        
        return objSession.destroy(objErr => {
            return callback(objIsNotSignedIn);
        });
    }

    return objSession.update(objErr => callback(objErr));
}

// *****************************************************************************

/**
 * Service function to refresh the session when the user is not idle.
 * 
 * @public
 * @param {Object}   objSession  object of JWT session
 * @param {Function} callback    function for callback
 */
function touchSignedIn(objSession, callback) {
    if (!isSignedIn(objSession)) {
        return callback({ err: 'Error: user is not signed in!' });
    }
    if (!objSession.updatedAt || !objSession.update) {
        return callback({ err: 'Error: Problem with JWT!' });
    }

    // set a new "updatedAt" date
    objSession.updatedAt = Date.now();
    
    return objSession.update(objErr => callback(objErr));
}

// *****************************************************************************

/**
 * Service function to test whether a user is signed in.
 * 
 * @public
 * @param  {Object}   objSession  object of JWT session
 * @param  {Function} [callback]  (optional) function for callback
 * @return {Boolean}              true if user is singed in
 */
function isSignedIn(objSession, callback) {
    if (objSession && objSession.jwt && objSession.id) {
        return callback && callback(null, true) || true;
    }
    return callback && callback(null, false) || false;
}

// *****************************************************************************

/**
 * Service function to test if username is available.
 * 
 * @public
 * @param {String}   strUsername  string of username needs to be tested
 * @param {Function} callback     function for callback
 */
function isUsernameAvailable(strUsername, callback) {
    var regexUsername = new RegExp('^' + strUsername + '$', 'i');

    return Auth.find({ 'username': regexUsername },
            (objErr, arrUsers) => {

        if (objErr) {
            console.error(objErr);
            return callback(settings.errors.signIn.generalError);
        }
        return callback(null, Object.keys(arrUsers).length <= 0);
    });
}

// *****************************************************************************

/**
 * Service function to test whether an email is available. For this, all emails
 * of all users are tested against, not only the first onces.
 * 
 * @public
 * @param {String}   strEmail  string of email that needs to be tested
 * @param {Function} callback  function for callback
 */
function isEmailAvailable(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');

    return Auth.find({ 'email': regexEmail },
            (objErr, arrEmails) => {

        if (objErr) {
            console.error(objErr);
            return callback(settings.errors.signIn.generalError);
        }
        return callback(null, Object.keys(arrEmails).length <= 0);
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to generate the Redis session if it doesn't exist, yet.
 * 
 * @private
 * @param  {Object}   objSession  object of JWT session
 * @param  {Function} callback    function for callback
 */
function _generateSession(objSession, callback) {
    if (objSession && objSession.id && objSession.jwt) {
        return callback(null, objSession.jwt);
    }

    // this will be attached to the JWT
    var objClaims = {
        appName     : APPNAME,
        appUrl      : APPURL,
    };

    // generate the session
    return objSession.create(objClaims, (objErr, strToken) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, strToken);
    });
}

// *****************************************************************************

/**
 * Helper function to get the index of a given array,
 * if it appears in the given array of emails.
 * 
 * @private
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
 * Helper function to generate a Redis entry for the reset password process.
 * 
 * @private
 * @param {String}   strEmail  string of the email of the user who forgot the password
 * @param {Function} callback  function for callback
 */
function _generateResetPasswordRedisEntry(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');
    var objHash, strRId;

    return Auth.findOne({ 'email': regexEmail }, (objErr, objUser) => {
        if (objErr) {
            return callback(objErr);
        }
        else if (!objUser || !objUser.username) {
            return callback('No such email found!');
        }

        strRId  = uuid.v4();
        objHash = {
            userId   : objUser._id.toString(),
            createdAt: Date.now(),
        };
        
        return clients.redis.setex(
                'resp:' + strRId,
                settings.auth.resetPassword.maxAge,
                JSON.stringify(objHash),
                objErr => {

            if (objErr) {
                return callback(objErr);
            }
            return callback(null, strRId);
        });
    });
}

// *****************************************************************************

// TODO: remove is not necessary any more
/**
 * Helper function to get the user ID from the corresponding Redis entry
 * to reset proceed to resetting the user's password.
 * 
 * @private
 * @param {String}   strRId    string of Redis ID
 * @param {Function} callback  function for callback
 */
function _getUserIdFromResetPasswordRedisEntry(strRId, callback) {
    return clients.redis.get('resp:' + strRId, (objErr, objReply) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, JSON.parse(objReply));
    });
}

// *****************************************************************************

// TODO: remove is not necessary any more
/**
 * Helper function to delete a Redis entry responsible for password reset.
 * 
 * @private
 * @param {String}   strRId    string of the Redis ID
 * @param {Function} callback  function for callback
 */
function _deleteResetPasswordRedisEntry(strRId, callback) {
    return clients.redis.del('resp:' + strRId, (objErr) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null);
    });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn                = signIn;
module.exports.signUp                = signUp;
module.exports.signOut               = signOut;
module.exports.forgotUsername        = forgotUsername;
module.exports.forgotPassword        = forgotPassword;
module.exports.resetPassword         = resetPassword;
module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.verifyEmail           = verifyEmail;
module.exports.setEmail              = setEmail;
module.exports.checkSignedIn         = checkSignedIn;
module.exports.touchSignedIn         = touchSignedIn;
module.exports.isSignedIn            = isSignedIn;
module.exports.isUsernameAvailable   = isUsernameAvailable;
module.exports.isEmailAvailable      = isEmailAvailable;

// *****************************************************************************

})();