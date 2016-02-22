(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

// object of secrets for the export
var objAuth = { session: {}, accessToken: {}, refreshToken: {} };

// *****************************************************************************
// Session settings
// *****************************************************************************

/**
 * Session Redis keyspace.
 * @type {String}
 */
objAuth.session.keyspace = 'sess:'; // prefix in Redis

/**
 * Session encryption algorithm.
 * @type {String}
 */
objAuth.session.algorithm = 'HS256:';

/**
 * Session request key.
 * @type {String}
 */
objAuth.session.requestKey = 'jwtSession';

/**
 * Session request key.
 * @type {String}
 */
objAuth.session.requestArg = 'jwtToken';

/**
 * Session expiration time.
 * @type {Number}
 */
objAuth.session.maxAge = 7*24*60*60; // one week in seconds

/**
 * Session secret
 * @type {String}
 */
objAuth.session.secret = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Access token settings
// *****************************************************************************

/**
 * General settings for access token expiring date.
 * @type {Number}
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
 * @type {Number}
 */
objAuth.refreshToken.expiresIn = objAuth.session.expiresIn;

/**
 * General settings for refresh token secret.
 * @type {String}
 */
objAuth.refreshToken.secret = 'Some secret for the refresh token!';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    global.settings.auth = objAuth;
};

// module.exports = objAuth;

// *****************************************************************************

})();