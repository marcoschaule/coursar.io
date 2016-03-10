module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var flatten = require('gulp-flatten');

// *****************************************************************************
// Basic tasks - assets
// *****************************************************************************

/**
 * Task to copy the assets to the ".build" folder for development.
 */
gulp.task('assets:dev', () => gulp
    .src(['./assets/**/*'])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/assets/')));

// *****************************************************************************

/**
 * Task to copy the assets to the ".build" folder for production.
 */
gulp.task('assets:prod', () => gulp
    .src(['./assets/**/*'])
    .pipe(flatten())
    .pipe(gulp.dest('./.build/prod/assets/')));

// *****************************************************************************

};
