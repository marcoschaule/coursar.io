module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var runSequence = require('run-sequence');
var stylus      = require('gulp-stylus');
var flatten     = require('gulp-flatten');

// *****************************************************************************
// Basic tasks - styles
// *****************************************************************************

/**
 * Task to build CSS from stylus from layout and
 * components folders for development.
 */
gulp.task('styles:dev', callback => runSequence(
    'styles-vendor:dev',
    'styles-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to build user CSS from stylus from layout and
 * components folders for development.
 */
gulp.task('styles-user:dev', () => gulp
    .src([
        'client/layout/layout.styl',
        'client/components/**/*.styl',
    ])
    .pipe(stylus())
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/styles/'))
);

// *****************************************************************************

/**
 * Task to build vendor CSS from stylus of the layout and
 * components folders for development.
 */
gulp.task('styles-vendor:dev', () => gulp
    .src(['./.build/vendor/**/*.css', '!./.build/vendor/**/*.min.css'])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/styles/vendor'))
);

// *****************************************************************************

};
