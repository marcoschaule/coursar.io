(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

// object of secrets for the export
var objAuth = { session: {} };

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
objAuth.session.algorithm = 'HS256';

/**
 * Session request key.
 * @type {String}
 */
objAuth.session.requestKey = 'session';

/**
 * Session request key.
 * @type {String}
 */
objAuth.session.requestArg = 'accessToken';

/**
 * Session expiration time.
 * @type {Number}
 */
objAuth.session.sessionAge = 1*60; // 1*1*60*60; // one hour in seconds

/**
 * Session remember time.
 * @type {Number}
 */
objAuth.session.maxAge = 2*60; // 7*24*60*60; // one week in seconds

/**
 * Session secret
 * @type {String}
 */
objAuth.session.secret = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    global.settings.auth = objAuth;
};

// module.exports = objAuth;

// *****************************************************************************

})();