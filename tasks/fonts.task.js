module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var flatten = require('gulp-flatten');

// *****************************************************************************
// Basic tasks - fonts
// *****************************************************************************

/**
 * Task to copy all fonts to development folder.
 */
gulp.task('fonts:dev', () => gulp
    .src([
        './.build/vendor/**/*.eot',
        './.build/vendor/**/*.svg',
        './.build/vendor/**/*.ttf',
        './.build/vendor/**/*.woff',
        './.build/vendor/**/*.woff2',
    ])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/fonts'))
);

// *****************************************************************************

/**
 * Task to copy all fonts to development folder.
 */
gulp.task('fonts:prod', () => gulp
    .src([
        './.build/vendor/**/*.eot',
        './.build/vendor/**/*.svg',
        './.build/vendor/**/*.ttf',
        './.build/vendor/**/*.woff',
        './.build/vendor/**/*.woff2',
    ])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/prod/fonts'))
);

// *****************************************************************************

};
