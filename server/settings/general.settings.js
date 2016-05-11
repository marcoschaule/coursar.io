(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.general = { system: {}, smtp: {} };

// *****************************************************************************
// System settings
// *****************************************************************************

/**
 * System protocol
 * @type {String}
 */
settings.general.system.protocol = 'http';

/**
 * System host.
 * @type {String}
 */
settings.general.system.host = 'localhost';

/**
 * System port number.
 * @type {Number}
 */
settings.general.system.port = 3000;

/**
 * System URL.
 * @type {String}
 */
settings.general.system.url = _createSystemUrl();

// *****************************************************************************
// Email settings
// *****************************************************************************

/**
 * Email SMTP user name.
 * @type {String}
 */
settings.general.smtp.username = 'email-user';

/**
 * Email SMTP password.
 * @type {String}
 */
settings.general.smtp.password = 'email-password';

/**
 * Email SMTP host.
 * @type {String}
 */
settings.general.smtp.host = 'email-host';

/**
 * Email SMTP port.
 * @type {String}
 */
settings.general.smtp.port = 587; // default ports: 25, 462, 465, 587

/**
 * Email SMTP URI, build of previous information.
 * @type {String}
 */
settings.general.smtp.uri = _createSmtpUri();

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Function to create the SMTP URI.
 * @return {String}  string of the STMP URI
 */
function _createSystemUrl() {
    return [
        settings.general.system.protocol,
        '://',
        settings.general.system.host,
        ':',
        settings.general.system.port,
    ].join('');
}

// *****************************************************************************

/**
 * Function to create the SMTP URI.
 * @return {String}  string of the STMP URI
 */
function _createSmtpUri() {
    return [
        'smtp://',
        settings.general.smtp.username,
        ':',
        settings.general.smtp.password,
        '@',
        settings.general.smtp.host,
        ':',
        settings.general.smtp.port
    ].join('');
}

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();