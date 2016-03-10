module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var jade     = require('gulp-jade');
var prettify = require('gulp-prettify');
var useref   = require('gulp-useref');
var gulpif   = require('gulp-if');
var uglify   = require('gulp-uglify');
var cssnano  = require('gulp-cssnano');

// *****************************************************************************
// Basic tasks - production
// *****************************************************************************

/**
 * Task to create production layout, scripts and styles. Needs the development
 * build task to run before.
 */
gulp.task('create:prod', () => gulp
    .src('client/layout/layout.jade')
    .pipe(jade())
    .pipe(prettify({ indent_size: 4 }))
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulp.dest('./.build/prod/'))
);

// *****************************************************************************

};
