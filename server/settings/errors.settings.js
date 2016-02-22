(function() { 'use strict';

// ********************************************************************************
// Settings object
// ********************************************************************************

// object of errors for the export
var objErrors = {
    signIn: {},
    signUp: {},
    resetPassword: {},
    checkAuthentication: {}
};

// *****************************************************************************
// Errors for "sign in"
// *****************************************************************************

/**
 * Error object for "sign in" scenario "general error".
 * @type {Object}
 */
objErrors.signIn.generalError = {
    status : 500,
    code   : 1000,
    message: 'General error with sign in!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "user not found".
 * @type {Object}
 */
objErrors.signIn.userNotFound = {
    status : 401,
    code   : 1001,
    message: 'User not found!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "password invalid".
 * @type {Object}
 */
objErrors.signIn.passwordInvalid = {
    status : 401,
    code   : 1002,
    message: 'Password not valid!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "username or password wrong".
 * @type {Object}
 */
objErrors.signIn.usernameOrPasswordWrong = {
    status : 401,
    code   : 1003,
    message: 'Username or password wrong!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "email or password wrong".
 * @type {Object}
 */
objErrors.signIn.emailOrPasswordWrong = {
    status : 401,
    code   : 1004,
    message: 'Email or password wrong!',
};

// *****************************************************************************

/**
 * Error object for "sign in" scenario "username/email or password wrong".
 * @type {Object}
 */
objErrors.signIn.userOrPasswordWrong = {
    status : 401,
    code   : 1005,
    message: 'Username/email or password wrong!',
};

// *****************************************************************************
// Errors for "sign up"
// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
objErrors.signUp.generalError = {
    status : 500,
    code   : 1100,
    message: 'General error with sign in!',
};

// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
objErrors.signUp.usernameNotAvailable = {
    status : 401,
    code   : 1101,
    message: 'Username not available!',
};

// *****************************************************************************

/**
 * Error object for "sign up" scenario "general error".
 * @type {Object}
 */
objErrors.signUp.emailNotAvailable = {
    status : 401,
    code   : 1102,
    message: 'Email not available!',
};

// *****************************************************************************
// Errors for "check authentication"
// *****************************************************************************

/**
 * Error object for "check authentication" scenario "access token invalid".
 * @type {Object}
 */
objErrors.checkAuthentication.accessTokenInvalid = {
    status : 401,
    code   : 1011,
    message: 'Access token invalid!',
};

// *****************************************************************************

/**
 * Error object for "check authentication" scenario "refresh token expired".
 * @type {Object}
 */
objErrors.checkAuthentication.refreshTokenInvalid = {
    status : 401,
    code   : 1012,
    message: 'Refresh token expired!',
};

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    if (!global.settings) {
        global.settings = {};
    }

    global.settings.errors = objErrors;
};

// module.exports = objErrors;

// ********************************************************************************

})();