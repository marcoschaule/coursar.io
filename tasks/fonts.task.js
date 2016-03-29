module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var flatten = require('gulp-flatten');

var arrFontSources = [
    './.build/vendor/**/*.otf',
    './.build/vendor/**/*.eot',
    './.build/vendor/**/*.svg',
    './.build/vendor/**/*.ttf',
    './.build/vendor/**/*.woff',
    './.build/vendor/**/*.woff2',
];

// *****************************************************************************
// Basic tasks - fonts
// *****************************************************************************

/**
 * Task to copy all fonts to user development folder.
 */
_setupTaskFonts('dev');

// *****************************************************************************

/**
 * Task to copy all fonts to admin development folder.
 */
_setupTaskFonts('dev-admin');

// *****************************************************************************

/**
 * Task to copy all fonts to user production folder.
 */
_setupTaskFonts('prod');

// *****************************************************************************

/**
 * Task to copy all fonts to admin production folder.
 */
_setupTaskFonts('prod-admin');

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task for copying the fonts.
 *
 * @private
 * @param {String} strWhich  string of which folder to copy from and into
 */
function _setupTaskFonts(strWhich) {
    var isAdmin = strWhich.indexOf('admin') >= 0;
    var strName = `fonts:${strWhich}`;
    var strDest = `./.build/${strWhich}/fonts/`;

    gulp.task(strName, () => gulp
        .src(_getArrFontSources(isAdmin))
        .pipe(flatten())
        .pipe(gulp.dest(strDest))
    );
}

// *****************************************************************************

/**
 * Helper function to get an array of the font sources to copy them from.
 *
 * @private
 * @param  {Boolean} isAdmin  true if to copy the fonts from the admin folder
 * @return {Array}            array of the paths of the font sources
 */
function _getArrFontSources(isAdmin) {
    var strAdmin  = isAdmin ? 'vendor-admin' : 'vendor';
    return arrFontSources.map((strSource) => strSource.replace(/vendor/gi, strAdmin));
}

// *****************************************************************************

};
