module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var runSequence = require('run-sequence');
var flatten     = require('gulp-flatten');

// *****************************************************************************
// Basic tasks - scripts
// *****************************************************************************

/**
 * Task to copy user and vendor scripts
 * for development.
 */
gulp.task('scripts:dev', callback => runSequence(
    'scripts-vendor:dev',
    'scripts-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to copy the user scripts to the build
 * folder for development.
 */
gulp.task('scripts-user:dev', () => gulp
    .src([
        'client/libs/**/*.js',
        'client/client.js',
        'client/components/**/*.js'
    ])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/scripts/'))
);

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build
 * folder for development.
 */
gulp.task('scripts-vendor:dev', () => gulp
    .src(['./.build/vendor/**/*.js', '!./.build/vendor/**/*.min.js'])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/scripts/vendor'))
);

// *****************************************************************************

};
