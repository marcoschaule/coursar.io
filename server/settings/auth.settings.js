(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.auth = { session: {}, resetPassword: {} };

// *****************************************************************************
// Session settings
// *****************************************************************************

/**
 * Session Redis key space.
 * @type {String}
 */
settings.auth.session.keyspace = 'sess:'; // prefix in Redis

/**
 * Session encryption algorithm.
 * @type {String}
 */
settings.auth.session.algorithm = 'HS256';

/**
 * Session request key.
 * @type {String}
 */
settings.auth.session.requestKey = 'session';

/**
 * Session request key.
 * @type {String}
 */
settings.auth.session.requestArg = 'accessToken';

/**
 * Session expiration time.
 * @type {Number}
 */
settings.auth.session.sessionAge = 1*1*60*60; // one hour in seconds

/**
 * Session remember time.
 * @type {Number}
 */
settings.auth.session.maxAge = 7*24*60*60; // one week in seconds

/**
 * Session secret.
 * @type {String}
 */
settings.auth.session.secret = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Reset password settings
// *****************************************************************************

/**
 * Maximum age of a reset password session.
 * @type {[type]}
 */
settings.auth.resetPassword.maxAge = 5*60; // five minutes in seconds

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();