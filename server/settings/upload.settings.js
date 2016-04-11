(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.upload = { media: {}, images: {} };

// *****************************************************************************
// Upload settings
// *****************************************************************************

/**
 * Common file upload file name format.
 * @type {String}
 */
settings.upload.fileNameFormat = '{{date}}_{{fileName}}';

/**
 * Common file upload date format.
 * @type {String}
 */
settings.upload.dateFormat = 'YYYY-MM-DD_HH-mm-ss';

/**
 * Media file upload destination.
 * @type {String}
 */
settings.upload.dest = './.uploads';

/**
 * Media file upload limit.
 * @type {[type]}
 */
settings.upload.limit = 1000*1000;

// *****************************************************************************

})();