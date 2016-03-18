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
 * @public
 * @param {Object}   req                    object of Express request
 * @param {Object}   req.body               object of request body
 * @param {String}   req.body.username      string of new user's username
 * @param {String}   req.body.password      string of new user's password
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
        ua: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress,
    };

    return AuthService.signIn(objUser, objInfo, req.session, (objErr, objProfile, strToken) => {
        if (objErr) {
            return res.status(objErr.err.status || objErr.status || 500).json(objErr);
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
 * @public
 * @param {Object}   req                object of Express request
 * @param {Object}   req.body           object of request body
 * @param {Object}   req.body.email     string of new user's email
 * @param {String}   req.body.username  string of new user's username
 * @param {String}   req.body.password  string of new user's password
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

/**
 * Controller function to sign a user out.
 *
 * @public
 * @param {Object}   req          object of Express request
 * @param {Object}   req.session  object of user's session
 * @param {Object}   res          object of Express response
 * @param {Function} next         function of callback for next middleware
 */
function signOut(req, res, next) {
    return AuthService.signOut(req.session, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return res.status(200).json({ isRedirect: true });
    });
}

// *****************************************************************************

/**
 * Controller function to verify the email.
 * 
 * @public
 * @param {Object}   req                 object of express default request
 * @param {Object}   res                 object of express default response
 * @param {Object}   req.session         object of user's session
 * @param {String}   req.session.userId  string of the user's MongoDB ID
 * @param {String}   req.session.email   string of the user's email
 * @param {Function} next                function for next middleware
 */
function sendVerificationEmail(req, res, next) {
    return AuthService.sendVerificationEmail(
            req.session.userId,
            req.session.email,
            objErr => {
        
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return res.status(201).json({ success: true });
    });
}

// *****************************************************************************

/**
 * Controller function to verify the email.
 * 
 * @public
 * @param {Object}   req              object of express default request
 * @param {Object}   res              object of express default response
 * @param {Object}   req.body         object of request parameters
 * @param {String}   req.body.strRId  string of the Redis entry ID
 * @param {Function} next             function for next middleware
 */
function verifyEmail(req, res, next) {
    return AuthService.verifyEmail(req.body.rid, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json(objErr);
        }
        return res.status(201).json({ success: true });
    });
}

// *****************************************************************************

/**
 * Controller function to request the username if forgotten.
 * 
 * @public
 * @param {Object}   req             object of default express request
 * @param {Object}   req.body        object of request body
 * @param {String}   req.body.email  string of the user's email
 * @param {Object}   res             object of default express response
 * @param {Function} next            function for next middleware
 */
function forgotUsername(req, res, next) {
    return AuthService.forgotUsername(req.body.email, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json({});
        }
        return res.status(201).json({});
    });
}

// *****************************************************************************

/**
 * Controller function to request the password if forgotten.
 * 
 * @public
 * @param {Object}   req             object of default express request
 * @param {Object}   req.body        object of request body
 * @param {String}   req.body.email  string of the user's email
 * @param {Object}   res             object of default express response
 * @param {Function} next            function for next middleware
 */
function forgotPassword(req, res, next) {
    return AuthService.forgotPassword(req.body.email, objErr => {
        if (objErr) {
            return res.status(500).json({});
        }
        return res.status(201).json({});
    });
}

// *****************************************************************************

/**
 * Controller function to reset the user's password.
 *
 * @public
 * @param {Object}   req                object of default express request
 * @param {Object}   req.body           object of request body
 * @param {Object}   req.body.rid       string of the Redis id from the email
 * @param {String}   req.body.password  string of the new password
 * @param {Object}   res                object of default express response
 * @param {Function} next               function for next middleware
 */
function resetPassword(req, res, next) {
    return AuthService.resetPassword(req.body.rid, req.body.password, objErr => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }
        return res.status(201).json({ success: true });
    });
}

// *****************************************************************************

/**
 * Controller function to check if the user is still signed in.
 * 
 * @public
 * @param {Object}   req          object of express default request
 * @param {Object}   res.session  object of user's session
 * @param {Object}   res          object of express default response
 * @param {Function} next         function for next middleware
 */
function checkSignedIn(req, res, next) {
    return AuthService.checkSignedIn(req.session, next);
}

// *****************************************************************************

/**
 * Controller function to refresh the session on user action.
 * 
 * @public
 * @param {Object}   req          object of express default request
 * @param {Object}   req.session  object of user's session
 * @param {Object}   res          object of express default response
 * @param {Function} next         function for next middleware
 */
function touchSignedIn(req, res, next) {
    return AuthService.touchSignedIn(req.session, objErr => {
        return next();
    });
}

// *****************************************************************************

/**
 * Controller function to test if a user is signed in.
 *
 * @public
 * @param {Object}   req          object of Express request
 * @param {Object}   req.session  object of user's session
 * @param {Object}   res          object of Express response
 * @param {Function} next         function of callback for next middleware
 */
function isSignedIn(req, res, next) {
    var _isSignedIn = AuthService.isSignedIn(req.session);
    return res.status(200).json({ isSignedIn: _isSignedIn });
}

// *****************************************************************************

/**
 * Controller function to test if an username or an email is available.
 *
 * @public
 * @param {Object}   req                object of default express request
 * @param {Object}   req.body           object of request body
 * @param {String}   req.body.email     string of the email to be tested
 * @param {String}   req.body.username  string of the username to be tested
 * @param {Object}   res                object of default express response
 * @param {Function} next               function for next middleware
 */
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
// Middleware functions
// *****************************************************************************

/**
 * Middleware function to authorize requests, add headers, check if they are
 * signed in and if not, inform client to redirect.
 * 
 * @public
 * @param {Object}   req   object of express default request
 * @param {Object}   res   object of express default response
 * @param {Function} next  function for next middleware
 */
function authorize(req, res, next) {
    return AuthService.checkSignedIn(req.session, objErr => {
        if (objErr) {
            console.error(objErr);
            return next({ err: 'Error: user is not signed in!', redirect: true, status: 401 });
        }
        
        // set access token and CSRF token in header
        res.set('X-Access-Token', req.session.jwt);
        res.set('X-CSRF-Token',   'CSRF-Token');

        return next(null);
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
module.exports.checkSignedIn         = checkSignedIn;
module.exports.touchSignedIn         = touchSignedIn;
module.exports.isSignedIn            = isSignedIn;
module.exports.isAvailable           = isAvailable;
module.exports.authorize             = authorize;

// *****************************************************************************
// Helpers
// *****************************************************************************
    
// *****************************************************************************

})();