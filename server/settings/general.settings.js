(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

// object of secrets for the export
var objGeneral = { accessToken: {}, refreshToken: {} };

// *****************************************************************************
// Access token settings
// *****************************************************************************

/**
 * General settings for access token expiring date.
 * @type {String}
 */
objGeneral.accessToken.expiresIn = 5*60; // five minutes in seconds

/**
 * General settings for access token secret.
 * @type {String}
 */
objSecrets.accessToken.secret = 'Some secret for the access token!';

// *****************************************************************************
// Refresh token settings
// *****************************************************************************

/**
 * General settings for refresh token expiring date.
 * @type {String}
 */
objGeneral.refreshToken.expiresIn = 7*24*60*60; // one week in seconds

/**
 * General settings for refresh token secret.
 * @type {String}
 */
objSecrets.refreshToken.secret = 'Some secret for the refresh token!';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    if (!global.settings) {
        global.settings = {};
    }

    global.settings.general = objGeneral;
};

// module.exports = objGeneral;

// *****************************************************************************

})();