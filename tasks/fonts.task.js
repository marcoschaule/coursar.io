module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var flatten        = require('gulp-flatten');
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
 * Task to copy all fonts to development folder.
 */
gulp.task('fonts:dev', () => gulp
    .src(arrFontSources)
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/fonts'))
);

// *****************************************************************************

/**
 * Task to copy all fonts to development folder.
 */
gulp.task('fonts:prod', () => gulp
    .src(arrFontSources)
    .pipe(flatten())
    .pipe(gulp.dest('./.build/prod/fonts'))
);

// *****************************************************************************

};
