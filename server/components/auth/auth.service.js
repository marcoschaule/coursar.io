(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var mongoose       = require('mongoose');
var uuid           = require('uuid');
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

    return Auth.findOne({ $or: [
            { 'username'          : regexUsername },
            { 'emails.0.address'  : regexUsername },
        ] }, (objErr, objUser) => {
        
        if (objErr) {
            return callback(settings.errors.signIn.generalError);
        }
        else if (!objUser || !objUser.compare(objSignIn.password)) {
            return callback(settings.errors.signIn.usernameOrPasswordWrong);
        }

        // get MongoDB user id
        var strUserId = objUser._id.toString();

        // this will be stored in redis
        objSession.userId       = strUserId;
        objSession.createdAt    = Date.now();
        objSession.updatedAt    = Date.now();
        objSession.sessionAge   = settings.auth.session.sessionAge;
        objSession.isRemembered = objSignIn.isRemembered;
        objSession.ua           = objInfo.ua;
        objSession.ip           = objInfo.ip;
        objSession.ipo          = null;
        objSession.isSignedIn   = true;

        return _generateSession(objSession, (objErr, strToken) => {
            if (objErr) {
                return callback(objErr);
            }

            // this will be send back to the user
            objUserReturn._id       = strUserId;
            objUserReturn.username  = objUser.username;

            return callback(null, objUserReturn, strToken);
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
    var objPassword, objUserReturn, docUser, objErrValidation;

    // validate user data
    docUser = new SignUp({
        email    : objSignUp.email,
        username : objSignUp.username,
        password : objSignUp.password,
    });
    objErrValidation = docUser.validateSync();

    if (objErrValidation) {
        return callback(objErrValidation);
    }

    // encrypt password
    objPassword = Auth.encrypt(objSignUp.password);

    return Auth.findOne({ $or: [
            { 'username': { $regex: objSignUp.username, $options: 'i' } },
            { 'emails': { $elemMatch: { address: { $regex: objSignUp.email, $options: 'i' } } } },
    ] }, (objErr, objUser) => {
        if (objErr) {
            return callback(settings.errors.signUp.generalError);
        }
        else if (objUser && objUser.profile && objUser.profile.username === objSignUp.username) {
            return callback(settings.errors.signUp.usernameNotAvailable);
        }
        else if (objUser && objUser.profile && _indexOfEmailInArray(objUser.emails, objSignUp.email) >= 0) {
            return callback(settings.errors.signUp.emailNotAvailable);
        }

        // create a new authenticated user
        var objAuth = new Auth({
            username: objSignUp.username,
            emails  : [{
                address : objSignUp.email,
                verified: false,
            }],
            password: {
                hash: objPassword.hash,
                salt: objPassword.salt,
            },
        });

        return objAuth.save(objErr => {
            if (objErr) {
                return callback(objErr);
            }
            return callback(null, objSignUp);
        });
    });
}

// *****************************************************************************

/**
 * Service function to sign out. It destroys the session in redis
 * and the JWToken.
 * 
 * @param {Object}   objSession  object of session
 * @param {Function} callback    function for callback
 */
function signOut(objSession, callback) {
    return objSession.destroy(objErr => callback(null));
}

// *****************************************************************************

/**
 * Service function to handle a "forgot password" request. This function sends
 * an email to the user including a link to reset the password.
 * @public
 * 
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
        (_callback) => Auth.findOne({ 'emails.0.address': regexEmail }, (objErr, objUser) => {
            if (objErr) {
                console.error(objErr);
                return _callback(objErr);
            }
            else if (!objUser || !objUser._id) {
                console.error('No such email found!');
                return _callback('No such email found!');
            }
            return _callback(null, objUser._id.toString());
        }),

        // set the Redis entry and receive the Redis ID
        (strUserId, _callback) => libRedis.setRedisEntryForPasswordReset(strUserId, (objErr, strRId) => {
            if (objErr) {
                console.error(objErr);
                return _callback(settings.errors.resetPassword.generalError);
            }
            return _callback(null, strRId);
        }),

        // send the email to the given email address
        (strRId, _callback) => libEmail.sendEmailForgotPassword(strEmail, strRId, (objErr, objResult) => {
            if (objErr) {
                console.error(objErr);
                return _callback(settings.errors.resetPassword.generalError);
            }
            return _callback(null);
        }),
    
    // async waterfall callback
    ], callback);
}

// *****************************************************************************

/**
 * Service function to reset the password, depending on the Redis ID send
 * from the user.
 * 
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
        (_callback) => libRedis.getRedisEntry(strKey, (objErr, objReply) => {
            if (objErr) {
                console.error(objErr);
                return _callback(settings.errors.resetPassword.generalError);
            }
            if (!objReply || !objReply.userId) {
                console.error('Redis entry does not exist anymore!');
                return _callback(settings.errors.resetPassword.sessionExpired);
            }
            return _callback(null, objReply.userId.toString());
        }),

        // update password in database
        (strUserId, _callback) => Auth.update(
                { _id: strUserId },
                { $set: { 'password.salt': objPassword.salt, 'password.hash': objPassword.hash } },
                (objErr, objModified) => {
           
            if (objErr) {
               console.error(objErr);
               return _callback(settings.errors.resetPassword.generalError);
            }
            return _callback(null);
        }),

        // delete Redis entry with MongoDB user ID
        (_callback) => libRedis.deleteRedisEntry(strKey, objErr => {
            if (objErr) {
                console.error(objErr);
                return _callback(settings.errors.resetPassword.generalError);
            }
            return _callback(null);
        })

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
 * @param {String}   strUserId    string of user id
 * @param {String}   strEmailNew  string of new or existing email address
 * @param {Function} callback     function for callback
 */
function setEmail(strUserId, strEmailNew, callback) {
    var objEmailNew = { address: strEmailNew, isValidated: false };
    var isValidated = false;
    var numPosition = -1;

    return Auth.findOne({ _id: strUserId }, (objErr, objUser) => {
        if (objErr || !objUser || !objUser.profile || !objUser.emails) {
            return callback(true);
        }

        // Check existing emails, if given email is already saved.
        // If yes, use field "isValidated" for re-ordering the emails.
        numPosition = _indexOfEmailInArray(objUser.emails, strEmailNew);
        objEmailNew = objUser.emails[numPosition];

        return async.series([

            // remove email from array if available
            _callback => {
                if (numPosition < 0) {
                    return _callback(null);
                }

                return Auth.update({ _id: strUserId }, { $pull: 
                        { 'emails': { _id: objEmailNew._id } } },
                        _callback);
            },

            // add email to position 0
            _callback => {
                return Auth.update({ _id: strUserId }, { $push:
                        { 'emails': { $each: [objEmailNew], $position: 0 } } },
                        _callback);
            },

        // async series callback
        ], callback);
    });
}

// *****************************************************************************

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

    return objSession.update(objErr => {
        return callback(objErr || null);
    });
}

// *****************************************************************************

function touchSignedIn(objSession, callback) {
    if (!isSignedIn(objSession)) {
        return callback();
    }

    // set a new "updatedAt" date
    objSession.updatedAt = Date.now();
    
    return objSession.update(objErr => callback(objErr));
}

// *****************************************************************************

/**
 * Service function to test whether a user is signed in.
 * 
 * @param  {Object}   objSession  object of JWT session
 * @param  {Function} [callback]  (optional) function for callback
 * @return {Boolean}              true if user is singed in
 */
function isSignedIn(objSession, callback) {
    if (objSession && objSession.isSignedIn) {
        return callback && callback(null, true) || true;
    }
    return callback && callback(null, false) || false;
}

// *****************************************************************************

/**
 * Service function to test if username is available.
 * 
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

function isEmailAvailable(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');

    return Auth.find({ 'emails': { $elemMatch: { 'address': regexEmail } } },
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

function _validateSignUp(objSignUp) {
    var docUser = new SignUp({
        email    : objSignUp.email,
        username : objSignUp.username,
        password : objSignUp.password,
    });
    return docUser.validateSync();
}

// *****************************************************************************

/**
 * Helper function to generate the Redis session if it doesn't exist, yet.
 * 
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
 * @private
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

function _generateResetPasswordRedisEntry(strEmail, callback) {
    var regexEmail = new RegExp('^' + strEmail + '$', 'i');
    var objHash, strRId;

    return Auth.findOne({ 'emails.0.address': regexEmail }, (objErr, objUser) => {
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

function _getUserIdFromResetPasswordRedisEntry(strRId, callback) {
    return clients.redis.get('resp:' + strRId, (objErr, objReply) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, JSON.parse(objReply));
    });
}

// *****************************************************************************

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

module.exports.signIn              = signIn;
module.exports.signUp              = signUp;
module.exports.signOut             = signOut;
module.exports.forgotPassword      = forgotPassword;
module.exports.resetPassword       = resetPassword;
module.exports.setEmail            = setEmail;
module.exports.checkSignedIn       = checkSignedIn;
module.exports.touchSignedIn       = touchSignedIn;
module.exports.isSignedIn          = isSignedIn;
module.exports.isUsernameAvailable = isUsernameAvailable;
module.exports.isEmailAvailable    = isEmailAvailable;

// *****************************************************************************

})();