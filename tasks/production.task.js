module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var jade       = require('gulp-jade');
var prettify   = require('gulp-prettify');
var useref     = require('gulp-useref');
var gulpif     = require('gulp-if');
var uglify     = require('gulp-uglify');
var cssnano    = require('gulp-cssnano');
var ngAnnotate = require('gulp-ng-annotate');
var util       = require('gulp-util');
var htmlmin    = require('gulp-html-minifier');

// *****************************************************************************
// Basic tasks - production
// *****************************************************************************

/**
 * Task to create production layout, scripts and styles. Needs the development
 * build task to run before.
 */
gulp.task('create:prod', () => gulp
    .src('./.build/dev/layout.html')
    .pipe(useref())
    .pipe(gulpif('*.js', ngAnnotate({ add: true, single_quotes: true })))
    .pipe(gulpif('*.js', uglify().on('error', util.log)))
    .pipe(gulpif('*.css', cssnano()))
    .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('./.build/prod/'))
);

// *****************************************************************************

};
