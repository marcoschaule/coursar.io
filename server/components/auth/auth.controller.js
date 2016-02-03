(function() { 'use strict';

// *****************************************************************************
// Requires and definitions
// *****************************************************************************

var Auth        = require('./auth.schema.js').Auth;
var AuthService = require('./auth.service.js');

// *****************************************************************************
// Controller functions
// *****************************************************************************

/**
 * Controller function to sign in a user.
 * 
 * @param {Object}   req                    object of Express request
 * @param {Object}   req.body               object of request body
 * @param {Object}   req.body.username      string of new user's username
 * @param {Object}   req.body.password      string of new user's password
 * @param {Boolean}  req.body.isRemembered  true if user wants to be reminded
 * @param {Object}   res                    object of Express response
 * @param {Function} next                   function of callback for next middleware
 */
function signIn(req, res, next) {

    // create user object
    var objUser = {
        username    : req.body.username,
        password    : req.body.password,
        isRemembered: !!req.body.isRemembered,
    };

    // create object for additional (user) information
    var objInfo = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    console.log(">>> Debug ====================; objInfo:", objInfo, '\n\n');

    return AuthService.signIn(objUser, objInfo, (objErr, objProfile, strAccessToken) => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }

        var objReturn = {
            err        : null,
            user       : objProfile,
            accessToken: strAccessToken
        };

        return res.status(200).json(objReturn);
    });
}

// *****************************************************************************

/**
 * Controller function to sign in a user.
 * 
 * @param {Object}   req                object of Express request
 * @param {Object}   req.body           object of request body
 * @param {Object}   req.body.email     string of new user's email
 * @param {Object}   req.body.username  string of new user's username
 * @param {Object}   req.body.password  string of new user's password
 * @param {Object}   res                object of Express response
 * @param {Function} next               function of callback for next middleware
 */
function signUp(req, res, next) {

    // create user object
    var objUser = {
        email             : req.body.email,
        emailValidation   : req.body.emailValidation,
        username          : req.body.username,
        password          : req.body.password,
        passwordValidation: req.body.passwordValidation,
    };

    // validate user data
    // -- validation --

    return AuthService.signUp(objUser, (objErr, objUserResult) => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return signIn(req, res, next);
    });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn = signIn;
module.exports.signUp = signUp;

// *****************************************************************************
// Helpers
// *****************************************************************************
    
// *****************************************************************************

})();