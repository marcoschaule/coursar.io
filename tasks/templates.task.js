module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var through                = require('through2');
var jade                   = require('gulp-jade');
var flatten                = require('gulp-flatten');
var replace                = require('gulp-replace');
var rename                 = require('gulp-rename');
var prettify               = require('gulp-prettify');
var templateCache          = require('gulp-angular-templatecache');
var objTemplateCacheClient = { module: 'cio-templates' };
var objTemplateCacheAdmin  = { module: 'cio-admin-templates' };

// *****************************************************************************
// Basic tasks - layout and templates
// *****************************************************************************

/**
 * Task to create the main layout file for client.
 */
_setupTaskForLayout('client');

// *****************************************************************************

/**
 * Task to create the main layout file for admin.
 */
_setupTaskForLayout('admin');

// *****************************************************************************

/**
 * Task to build the templates for angular's template cache for client.
 */
_setupTaskForTemplates('client');

// *****************************************************************************

/**
 * Task to build the templates for angular's template cache for admin.
 */
_setupTaskForTemplates('admin');

// *****************************************************************************
// Basic tasks - statics
// *****************************************************************************

/**
 * Task to parse the static files for development and production.
 */
gulp.task('statics', ['statics:dev', 'statics:prod']);

// *****************************************************************************

/**
 * Task to parse the static files for client.
 */
_setupTaskForStatics('client');

// *****************************************************************************

/**
 * Task to parse the static files for admin.
 */
_setupTaskForStatics('admin');

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task for the main layout file.
 *
 * @private
 * @param {Array} strWhich  string of which target to create for
 */
function _setupTaskForLayout(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';

    gulp.task(`layout:dev${strExt}`, () => gulp
        .src([`./${strWhich}/components/layout/layout.jade`])
        .pipe(jade())
        .pipe(rename('layout.html'))
        .pipe(prettify({ indent_size: 4 }))
        .pipe(gulp.dest(`./.build/dev${strExt}/`))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task for the templates.
 *
 * @private
 * @param {String} strWhich  string of which target to create for
 */
function _setupTaskForTemplates(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';
    var objTempl = 'admin' === strWhich ?
        objTemplateCacheAdmin :
        objTemplateCacheClient;

    gulp.task(`templates${strExt}`, () => gulp
        .src([`./${strWhich}/components/**/*.template.jade`])
        .pipe(jade())
        .pipe(flatten())
        .pipe(templateCache('templates.js', objTempl))
        .pipe(gulp.dest(`./.build/dev${strExt}/scripts/`))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task for creating static files for 
 * development and production environment.
 *
 * @private
 * @param {String} strWhich  string of which target to create for
 */
function _setupTaskForStatics(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';
    
    gulp.task(`statics:dev${strExt}`, () => gulp
        .src(['./**/*.static.jade'])
        .pipe(rename(_renameStaticFilesRename))
        .pipe(jade())
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strExt}/`))
    );
    gulp.task(`statics:prod${strExt}`, () => gulp
        .src(['./**/*.static.jade'])
        .pipe(rename(_renameStaticFilesRename))
        .pipe(jade())
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/prod${strExt}/statics/`))
    );
}

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
