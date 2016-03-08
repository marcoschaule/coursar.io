(function() { 'use strict';

// *****************************************************************************
// Includes
// *****************************************************************************

var async = require('async');

// ********************************************************************************
// Settings object
// ********************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.errors = {
    common             : {},
    signIn             : {},
    signUp             : {},
    signOut            : {},
    resetPassword      : {},
    checkAuthentication: {},
};

// *****************************************************************************
// Errors for "common" cases
// *****************************************************************************

/**
 * Error object for the "common" scenario "general error".
 * @type {Object}
 */
settings.errors.common.general = {
    status : 500,
    code   : '1001',
    message: 'General error!',
};

// *****************************************************************************

/**
 * Error object for the "common" scenario "callback missing".
 * @type {Object}
 */
settings.errors.common.callbackMissing = {
    status : 500,
    code   : '1001',
    message: 'Callback is missing!',
};

// *****************************************************************************

/**
 * Error object for the "common" scenario "email invalid".
 * @type {Object}
 */
settings.errors.common.emailInvalid = {
    status : 400,
    code   : '1010',
    message: 'Email not valid!',
};

// *****************************************************************************
// Errors for "sign in"
// *****************************************************************************

/**
 * Error object for "sign in" scenario "general error".
 * @type {Object}
 */
settings.errors.signIn.generalError = {
    status : 500,
    code   : '2000',
    message: 'General error with sign in!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "user not found".
 * @type {Object}
 */
settings.errors.signIn.userNotFound = {
    status : 401,
    code   : '2001',
    message: 'User not found!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "password invalid".
 * @type {Object}
 */
settings.errors.signIn.passwordInvalid = {
    status : 401,
    code   : '2002',
    message: 'Password not valid!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "username or password wrong".
 * @type {Object}
 */
settings.errors.signIn.usernameOrPasswordWrong = {
    status : 401,
    code   : '2003',
    message: 'Username or password wrong!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "email or password wrong".
 * @type {Object}
 */
settings.errors.signIn.emailOrPasswordWrong = {
    status : 401,
    code   : '2004',
    message: 'Email or password wrong!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "username/email or password wrong".
 * @type {Object}
 */
settings.errors.signIn.userOrPasswordWrong = {
    status : 401,
    code   : '2005',
    message: 'Username/email or password wrong!',
};

// *****************************************************************************
// Errors for "sign up"
// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
settings.errors.signUp.generalError = {
    status : 500,
    code   : '2100',
    message: 'General error with sign up!',
};

// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
settings.errors.signUp.usernameNotAvailable = {
    status : 401,
    code   : '2101',
    message: 'Username not available!',
};

// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
settings.errors.signUp.emailNotAvailable = {
    status : 401,
    code   : '2102',
    message: 'Email not available!',
};

// *****************************************************************************
// Errors for "sign out"
// *****************************************************************************

/**
 * Error object for "sign out" scenario "general error".
 * @type {Object}
 */
settings.errors.signOut.generalError = {
    status : 500,
    code   : '2200',
    message: 'General error with sign out!',
};

// *****************************************************************************

/**
 * Error object for "sign out" scenario "general error".
 * @type {Object}
 */
settings.errors.signOut.tokenMissing = {
    status : 401,
    code   : '2201',
    message: 'Access token missing!',
};

// *****************************************************************************
// Errors for "check authentication"
// *****************************************************************************

/**
 * Error object for "check authentication" scenario "access token invalid".
 * @type {Object}
 */
settings.errors.checkAuthentication.accessTokenInvalid = {
    status : 401,
    code   : '2011',
    message: 'Access token invalid!',
};

// *****************************************************************************

/**
 * Error object for "check authentication" scenario "refresh token expired".
 * @type {Object}
 */
settings.errors.checkAuthentication.refreshTokenInvalid = {
    status : 401,
    code   : '2012',
    message: 'Refresh token expired!',
};

// *****************************************************************************
// Errors for "reset password"
// *****************************************************************************

/**
 * Error object for "reset password" scenario "general error".
 * @type {Object}
 */
settings.errors.resetPassword.generalError = {
    status : 500,
    code   : '2301',
    message: 'General error with password reset!',
};

// *****************************************************************************

/**
 * Error object for "reset password" scenario "session expired".
 * @type {Object}
 */
settings.errors.resetPassword.sessionExpired = {
    status : 500,
    code   : '2302',
    message: 'Reset password session is expired!',
};

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to map errors by their error code.
 * @private
 */
function _mapErrosToCode() {
    return async.each(settings.errors, (objErrorTypes, _callback) => {
        return async.each(objErrorTypes, (objErr, __callback) => {
            settings.errors[objErr.code] = objErr;
            return __callback();
        }, _callback);
    
    }, objErr => {
        if (objErr) {
            return console.error(objErr);
        }
    });

} _mapErrosToCode();

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();