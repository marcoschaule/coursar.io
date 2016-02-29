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
    var objReturn, objUser, objInfo;

    // create user object
    objUser = {
        username    : req.body.username,
        password    : req.body.password,
        isRemembered: !!req.body.isRemembered,
    };

    // create object for additional (user) information
    objInfo = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    return AuthService.signIn(objUser, req.session, (objErr, objProfile, strToken) => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }

        objReturn = {
            err  : null,
            user : objProfile,
            token: strToken
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

function signOut(req, res, next) {
    return AuthService.signOut(req.session, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return res.status(200).json({ isRedirect: true });
    });
}

// *****************************************************************************

function isSignedIn(req, res, next) {
    var _isSignedIn = AuthService.isSignedIn(req.session);
    return res.status(200).json({ isSignedIn: _isSignedIn });
}

// *****************************************************************************

function isAvailable(req, res, next) {
    var strWhich  = req.body.email ? 'email' : 'username';
    var strValue  = req.body[strWhich];
    var strMethod = 'email' === strWhich ?
            'isEmailAvailable' :
            'isUsernameAvailable';

    return AuthService[strMethod](strValue, (objErr, isAvailable) => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ isAvailable: isAvailable });
    });
}

// *****************************************************************************

function checkSignedIn(req, res, next) {
    return AuthService.checkSignedIn(req.session, next);
}

// *****************************************************************************

function touchSignedIn(req, res, next) {
    return AuthService.touchSignedIn(req.session, objErr => {
        return next();
    });
}

// *****************************************************************************

function idle(req, res, next) {
    return res.status(201).json({});
}

// *****************************************************************************
// Middleware functions
// *****************************************************************************

function middlewareAll(req, res, next) {
    return AuthService.generateSession(req.session, (objErr, strToken) => {
        if (objErr) {
            return next(objErr);
        }

        // set access token in response header; this will be used for
        // session management and authentication
        res.set('X-Access-Token', strToken);

        return AuthService.touchSignedIn(req.session, objErr => {
            return next();
        });
    });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn          = signIn;
module.exports.signUp          = signUp;
module.exports.signOut         = signOut;
module.exports.isSignedIn      = isSignedIn;
module.exports.isAvailable     = isAvailable;
module.exports.checkSignedIn   = checkSignedIn;
module.exports.touchSignedIn   = touchSignedIn;
module.exports.idle            = idle;
module.exports.middlewareAll   = middlewareAll;

// *****************************************************************************
// Helpers
// *****************************************************************************
    
// *****************************************************************************

})();