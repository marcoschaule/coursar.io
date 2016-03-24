module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var through                  = require('through2');
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
    .src(['./client/components/layout/layout.jade'])
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

/**
 * Task to parse the static files for development and production.
 */
gulp.task('statics', ['statics:dev', 'statics:prod']);

// *****************************************************************************

/**
 * Task to parse the static files for development.
 */
gulp.task('statics:dev', () => gulp
    .src(['./**/*.static.jade'])
    .pipe(rename(_renameStaticFilesRename))
    .pipe(jade())
    .pipe(flatten())
    .pipe(gulp.dest('./.build/dev/'))
);

// *****************************************************************************

/**
 * Task to parse the static files for production.
 */
gulp.task('statics:prod', () => gulp
    .src(['./**/*.static.jade'])
    .pipe(rename(_renameStaticFilesRename))
    .pipe(jade())
    .pipe(flatten())
    .pipe(gulp.dest('./.build/prod/statics/'))
);

// *****************************************************************************
// Helper functions
// *****************************************************************************


/**
 * Helper function to remove the ".static" and if necessary the "error." part
 * in static HTML file name using "rename".
 *
 * use it with .pipe(rename(_renameStaticFilesRename))
 *
 * @private
 * @param {Object} objPath  object of the path parts
 */
function _renameStaticFilesRename(objPath) {
    objPath.basename = objPath.basename.replace('.static', '');
    objPath.basename = objPath.basename.replace('error.', '');
}

// *****************************************************************************

/**
 * Helper function to remove the ".static" and if necessary the "error." part
 * in static HTML file name manually.
 *
 * use it with: .pipe(through.obj(_renameStaticFilesManually))
 * 
 * @private
 * @param  {Object}   objFile      object of the file
 * @param  {String}   strEncoding  string of the file encoding
 * @param  {Function} callback     function for callback
 */
function _renameStaticFilesManually(objFile, strEncoding, callback) {
    objFile.path = objFile.path.replace('.static', '');
    objFile.path = objFile.path.replace('error.', '');
    return callback(null, objFile);
}

// *****************************************************************************

};
