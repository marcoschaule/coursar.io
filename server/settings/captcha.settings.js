(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.captcha = { reCaptcha: {}, svgCaptcha: {} };

// *****************************************************************************
// Google's reCaptcha
// *****************************************************************************

/**
 * Google's reCaptcha public key.
 * @type {String}
 */
settings.captcha.reCaptcha.publicKey = '6LcXlhkTAAAAALxiFu69thW-i15n4b9S0iu8aUM8';

/**
 * Google's reCaptcha private key.
 * @type {String}
 */
settings.captcha.reCaptcha.privateKey = '6LcXlhkTAAAAAG1Y7zmmA_FM_WRExChR3RTK-D_X';

// *****************************************************************************
// SVG Captcha
// *****************************************************************************

/**
 * SVG Captcha's possible characters.
 * @type {String}
 */
settings.captcha.svgCaptcha.values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * SVG Captcha's number of characters.
 * @type {String}
 */
settings.captcha.svgCaptcha.length = 8;

/**
 * SVG Captcha's width of captcha in pixels.
 * @type {String}
 */
settings.captcha.svgCaptcha.width = 200;

/**
 * SVG Captcha's height of captcha in pixels.
 * @type {String}
 */
settings.captcha.svgCaptcha.height = 50;

/**
 * SVG Captcha's color enabler.
 * @type {String}
 */
settings.captcha.svgCaptcha.color = false;

/**
 * SVG Captcha's number of lines.
 * @type {String}
 */
settings.captcha.svgCaptcha.lines = 2;

/**
 * SVG Captcha's level of noise (points).
 * @type {String}
 */
settings.captcha.svgCaptcha.noise = 1;

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();