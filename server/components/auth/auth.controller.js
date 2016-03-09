(function() { 'use strict';

// *****************************************************************************
// Requires and definitions
// *****************************************************************************

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
        username    :   req.body.username,
        password    :   req.body.password,
        isRemembered: !!req.body.isRemembered,
    };

    // create object for additional (user) information
    objInfo = {
        ip: req.headers['x-forwarded-for'] ||
            req.headers['X-Forwarded-For'] ||
            req.connection.remoteAddress,
    };

    return AuthService.signIn(objUser, objInfo, req.session, (objErr, objProfile, strToken) => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }

        // set token in header; from now on,
        // header needs to be set for every request
        res.set('X-Access-Token', strToken);

        // this will go to the client
        objReturn = {
            err  : null,
            user : objProfile,
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
    return AuthService.signUp(req.body, (objErr, objUserResult) => {
        if (objErr) {
            return res.status(400).json({ err: settings.errors.signUp.generalError });
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

function forgotPassword(req, res, next) {
    return AuthService.forgotPassword(req.body.email, objErr => {
        if (objErr) {
            return res.status(500).json({});
        }
        return res.status(201).json({});
    });
}

// *****************************************************************************

function resetPassword(req, res, next) {
    return AuthService.resetPassword(req.body.rid, req.body.password, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return res.status(201).json({ success: true });
    });
}

// *****************************************************************************

function isSignedIn(req, res, next) {
    var _isSignedIn = AuthService.isSignedIn(req.session);
    return res.status(200).json({ isSignedIn: _isSignedIn });
}

// *****************************************************************************

function isAvailable(req, res, next) {
    var strWhich  = (req.body.email ? 'email' : 'username');
    var strValue  = req.body[strWhich];
    var strMethod = 'email' === strWhich ?
            'isEmailAvailable' :
            'isUsernameAvailable';

    return AuthService[strMethod](strValue, (objErr, isAvailable) => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ isAvailable: !!isAvailable });
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
    if (req.session && req.session.jwt) {
        res.set('X-Access-Token', req.session.jwt);
        return touchSignedIn(req, res, next);
    }
    return next();
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn         = signIn;
module.exports.signUp         = signUp;
module.exports.signOut        = signOut;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword  = resetPassword;
module.exports.isSignedIn     = isSignedIn;
module.exports.isAvailable    = isAvailable;
module.exports.checkSignedIn  = checkSignedIn;
module.exports.touchSignedIn  = touchSignedIn;
module.exports.idle           = idle;
module.exports.middlewareAll  = middlewareAll;

// *****************************************************************************
// Helpers
// *****************************************************************************
    
// *****************************************************************************

})();