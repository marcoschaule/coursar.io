(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

// object of secrets for the export
var objAuth = { accessToken: {}, refreshToken: {} };

// *****************************************************************************
// Access token settings
// *****************************************************************************

/**
 * General settings for access token expiring date.
 * @type {String}
 */
objAuth.accessToken.expiresIn = 5*60; // five minutes in seconds

/**
 * General settings for access token hashing algorithm.
 * @type {String}
 */
objAuth.accessToken.algorithm = 'HS256';

/**
 * General settings for access token secret.
 * @type {String}
 */
objAuth.accessToken.secret = 'Some secret for the access token!';

// *****************************************************************************
// Refresh token settings
// *****************************************************************************

/**
 * General settings for refresh token expiring date.
 * @type {String}
 */
objAuth.refreshToken.expiresIn = 7*24*60*60; // one week in seconds

/**
 * General settings for refresh token secret.
 * @type {String}
 */
objAuth.refreshToken.secret = 'Some secret for the refresh token!';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = objAuth;

// *****************************************************************************

})();