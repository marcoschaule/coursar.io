module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var jade                     = require('gulp-jade');
var flatten                  = require('gulp-flatten');
var replace                  = require('gulp-replace');
var rename                   = require('gulp-rename');
var prettify                 = require('gulp-prettify');
var templateCache            = require('gulp-angular-templatecache');
var objTemplateCacheSettings = {
    module: 'cio-templates'
};

// *****************************************************************************
// Basic tasks - layout and templates
// *****************************************************************************

/**
 * Task to build the layout HTML file for development.
 */
gulp.task('layout:dev', () => gulp
    .src(['./client/layout/layout.jade'])
    .pipe(jade())
    .pipe(rename('layout.html'))
    .pipe(prettify({ indent_size: 4 }))
    .pipe(gulp.dest('./.build/dev/'))
);

// *****************************************************************************

/**
 * Task to build the templates for angular's template cache.
 */
gulp.task('templates', () => gulp
    .src(['./client/components/**/*.template.jade'])
    .pipe(jade())
    .pipe(flatten())
    .pipe(templateCache('templates.js', objTemplateCacheSettings))
    .pipe(gulp.dest('./.build/dev/scripts/'))
);

// *****************************************************************************

};
