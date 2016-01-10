(function() { 'use strict';

// *****************************************************************************
// Requires
// *****************************************************************************

var fs            = require('fs');
var http          = require('http');
var path          = require('path');
var del           = require('del');
var exec          = require('child_process').exec;
var async         = require('async');

var gulp          = require('gulp');
var stylus        = require('gulp-stylus');
var jade          = require('gulp-jade');
var flatten       = require('gulp-flatten');
var concat        = require('gulp-concat');
var watch         = require('gulp-watch');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var domSrc        = require('gulp-dom-src');
var download      = require('gulp-download');
var gCallback     = require('gulp-callback');
var templateCache = require('gulp-angular-templatecache');
var runSequence   = require('run-sequence');

var vendor        = require('./client/vendor/vendor.json');

// *****************************************************************************
// Variables
// *****************************************************************************

var regexStyles   = new RegExp('\/\/- #begin styles(.|\n)*\/\/- #end styles\n');
var regexScripts  = new RegExp('\/\/- #begin scripts(.|\n)*\/\/- #end scripts\n');
var strStylesTag  = 'link(rel="stylesheet", href="styles.css")';
var strScriptsTag = 'link(rel="stylesheet", href="scripts.js")';

// *****************************************************************************
// Basic tasks
// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "/build/dev" folder for development.
 */
gulp.task('clean:dev', function() {
    return del(['build/dev/**/*']);
});

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "/build/prod" folder for production.
 */
gulp.task('clean:prod', function() {
    return del(['build/prod/**/*']);
});

// *****************************************************************************

/**
 * Task to build the layout HTML file for development.
 */
gulp.task('layout:dev', function() {
    return gulp
        .src(['client/layout/layout.jade'])
        .pipe(jade({ pretty: true }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build/dev/'));
});

// *****************************************************************************

/**
 * Task to build the layout HTML file for production.
 */
gulp.task('layout:prod', function() {
    return gulp
        .src(['client/layout/layout.jade'])
        .pipe(replace(regexStyles, strStylesTag))
        .pipe(replace(regexScripts, strScriptsTag))
        .pipe(jade({ pretty: true }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build/prod/'));
});

// *****************************************************************************

/**
 * Task to build the templates for angular's template cache.
 */
gulp.task('templates', function() {
    return gulp
        .src(['client/components/**/*.template.jade'])
        .pipe(jade())
        .pipe(templateCache())
        .pipe(gulp.dest('build/dev/scripts/'));
});

// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for development.
 */
gulp.task('styles:dev', function() {
    return gulp
        .src([
            'client/layout/layout.styl',
            'client/components/**/*.styl',
        ])
        .pipe(stylus())
        .pipe(flatten())
        .pipe(gulp.dest('build/dev/styles/'));
});

// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for production.
 */
gulp.task('styles:prod', ['styles:dev'], function() {
    return gulp
        .src([
            'client/layout/layout.styl',
            'client/components/**/*.styl',
        ])
        .pipe(stylus({ compress: true }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('build/prod/'));
});

// *****************************************************************************

/**
 * Task to start the server for development.
 */
gulp.task('server:dev', function(callback) {
    var server = exec('node server/server.js', function(objErr) {
        return ('function' === typeof callback && callback(objErr));
    });
    server.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
});

// *****************************************************************************

/**
 * Task to start the server for production.
 */
gulp.task('server:prod', function(callback) {
    var server = exec('NODE_ENV=prod node server/server.js', function(objErr) {
        return ('function' === typeof callback && callback(objErr));
    });
    server.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
});

// *****************************************************************************

/**
 * Task to download vendor files into vendor folder
 * defined in "vendor.json" file.
 */
gulp.task('vendor:dev', function(callback) {
    var arrFileTypes = ['.js', '.min.js', '.min.js.map'];
    var streamWriteFile, objRequest, strVendorUrl;

    return async.forEachOf(vendor.dependencies, function(objVendor, strFolder, _callbackOuter) {
        if (!objVendor || objVendor.modules.length <= 0 || !strFolder) {
            return _callbackOuter();
        }

        return async.each(objVendor.modules, function(strVendorModule, _callbackInner) {
            if (!strVendorModule) {
                return _callbackInner();
            }

            return async.each(arrFileTypes, function(strFileType, _callbackFinal) {
                strVendorUrl = objVendor.url
                    .replace('{module}', strVendorModule)
                    .replace('{version}', objVendor.version);
                strVendorUrl = strVendorUrl + strFileType;
                return download(strVendorUrl)
                    .pipe(gulp.dest('client/vendor/' + strFolder))
                    .on('end', _callbackFinal);
                
            }, _callbackInner);
        }, _callbackOuter);
    }, callback);
});

// *****************************************************************************
// Common tasks
// *****************************************************************************

/**
 * Task to build the dev files.
 */
gulp.task('build:dev', function(callback) {
    return runSequence('clean:dev', [
        'layout:dev',
        'templates',
        'styles:dev',
    ], callback);
});

/**
 * Task to run all development tasks.
 */
gulp.task('run:dev', function(callback) {
    return runSequence(
        'build:dev',
        'server:dev',
        callback);
});

/**
 * Default task.
 */
gulp.task('default', []);

// *****************************************************************************
// Watchers
// *****************************************************************************

// ********************************************************************************

})();