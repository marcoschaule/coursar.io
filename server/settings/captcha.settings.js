(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

var objCaptcha = { reCaptcha: {}, svgCaptcha: {} };

// *****************************************************************************
// Google's reCaptcha
// *****************************************************************************

/**
 * Google's reCaptcha public key.
 * @type {String}
 */
objCaptcha.reCaptcha.publicKey = '6LcXlhkTAAAAALxiFu69thW-i15n4b9S0iu8aUM8';

/**
 * Google's reCaptcha private key.
 * @type {String}
 */
objCaptcha.reCaptcha.privateKey = '6LcXlhkTAAAAAG1Y7zmmA_FM_WRExChR3RTK-D_X';

// *****************************************************************************
// SVG Captcha
// *****************************************************************************

/**
 * SVG Captcha's possible characters.
 * @type {String}
 */
objCaptcha.svgCaptcha.values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * SVG Captcha's number of characters.
 * @type {String}
 */
objCaptcha.svgCaptcha.length = 8;

/**
 * SVG Captcha's width of captcha in pixels.
 * @type {String}
 */
objCaptcha.svgCaptcha.width = 200;

/**
 * SVG Captcha's height of captcha in pixels.
 * @type {String}
 */
objCaptcha.svgCaptcha.height = 50;

/**
 * SVG Captcha's color enabler.
 * @type {String}
 */
objCaptcha.svgCaptcha.color = true;

/**
 * SVG Captcha's number of lines.
 * @type {String}
 */
objCaptcha.svgCaptcha.lines = 2;

/**
 * SVG Captcha's level of noise (points).
 * @type {String}
 */
objCaptcha.svgCaptcha.noise = 1;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    if (!global.settings) {
        global.settings = {};
    }

    global.settings.captcha = objCaptcha;
};

// module.exports = objGeneral;

// *****************************************************************************

})();