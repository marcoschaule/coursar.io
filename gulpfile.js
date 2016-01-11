(function() { 'use strict';

// *****************************************************************************
// Requires
// *****************************************************************************

var fs            = require('fs');
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
var cssnano       = require('gulp-cssnano');
var prettify      = require('gulp-prettify');
var sourcemaps    = require('gulp-sourcemaps');
var domSrc        = require('gulp-dom-src'); // TODO: delete
var download      = require('gulp-download');
var gCallback     = require('gulp-callback'); // TODO: delete
var templateCache = require('gulp-angular-templatecache');
var runSequence   = require('run-sequence');

var vendor        = require('./client/vendor.json');

// *****************************************************************************
// Variables
// *****************************************************************************

var regexStylesReplacer       = new RegExp('<\\!--\\s*\\{styles\}\\s*--\\>');
var regexScriptsReplacer      = new RegExp('<\\!--\\s*\\{scripts\}\\s*--\\>');

var strTemplateChacheFileName = 'templates.js';
var strStylesMinFileName      = 'styles.min.css';
var strScriptsMinFileName     = 'scripts.min.js';
var strStylesTag              = '<link rel="stylesheet" href="{path}"></link>';
var strScriptsTag             = '<script type="text/javascript" src="{path}"></script>';
var strPathScriptsUser        = path.join(__dirname, 'build/dev/scripts/');
var strPathScriptsVendor      = path.join(__dirname, 'build/dev/scripts/vendor/');
var strPathStylesUser         = path.join(__dirname, 'build/dev/styles/');
var strPathStylesVendor       = path.join(__dirname, 'build/dev/styles/vendor/');

var objTemplateCacheSettings  = {
    module: 'cou-templates'
};

var arrStyleFiles = [
    'styles/vendor/bootstrap.css',
    'styles/layout.css',
    'styles/auth.css',
];
var arrScriptFiles = [
    'scripts/vendor/angular.js',
    'scripts/vendor/angular-sanitize.js',
    'scripts/client.js',
    'scripts/templates.js',
    'scripts/auth.service.js',
    'scripts/sign-in.controller.js',
    'scripts/sign-up.controller.js',
    'scripts/reset-password.controller.js',
];
var arrStyleFilesMapped    = arrStyleFiles
    .map((strPath) => strStylesTag.replace('{path}', strPath));
var arrScriptFilesMapped   = arrScriptFiles
    .map((strPath) => strScriptsTag.replace('{path}', strPath));
var arrStyleFilesExtended  = arrStyleFiles
    .map((strPath) => path.join('build/dev/', strPath));
var arrScriptFilesExtended = arrScriptFiles
    .map((strPath) => path.join('build/dev/', strPath));

// *****************************************************************************
// Basic tasks - clean
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
// Basic tasks - layout and templates
// *****************************************************************************

/**
 * Task to build the layout HTML file for development.
 */
gulp.task('layout:dev', function() {
    return gulp
        .src(['client/layout/layout.jade'])
        .pipe(jade())
        .pipe(replace(regexStylesReplacer, arrStyleFilesMapped.join('\n')))
        .pipe(replace(regexScriptsReplacer, arrScriptFilesMapped.join('\n')))
        .pipe(rename('index.html'))
        .pipe(prettify({ indent_size: 4 }))
        .pipe(gulp.dest('build/dev/'));
});

// *****************************************************************************

/**
 * Task to build the layout HTML file for production.
 */
gulp.task('layout:prod', function() {
    return gulp
        .src(['client/layout/layout.jade'])
        .pipe(jade())
        .pipe(replace(regexStylesReplacer, strStylesTag
            .replace('{path}',  strStylesMinFileName)))
        .pipe(replace(regexScriptsReplacer, strScriptsTag
            .replace('{path}', strScriptsMinFileName)))
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
        .pipe(flatten())
        .pipe(templateCache(strTemplateChacheFileName, objTemplateCacheSettings))
        .pipe(gulp.dest('build/dev/scripts/'));
});

// *****************************************************************************
// Basic tasks - styles
// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for development.
 */
gulp.task('styles:dev', function(callback) {
    return runSequence(
        'styles-vendor:dev',
        'styles-user:dev',
        callback);
});

// *****************************************************************************

/**
 * Task to build user css from stylus from layout and
 * components folders for development.
 */
gulp.task('styles-user:dev', function() {
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
 * Task to build vendor css from stylus from layout and
 * components folders for development.
 */
gulp.task('styles-vendor:dev', function() {
    return gulp
        .src([
            'build/vendor/bootstrap/bootstrap.css',
        ])
        .pipe(flatten())
        .pipe(gulp.dest('build/dev/styles/vendor'));
});

// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for production.
 */
gulp.task('styles:prod', ['styles:dev'], function() {
    return gulp
        .src(arrStyleFilesExtended)
        .pipe(concat(strStylesMinFileName))
        .pipe(sourcemaps.init())
        .pipe(cssnano({ discardComments: { removeAll: true } }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/prod/'));
});

// *****************************************************************************
// Basic tasks - scripts
// *****************************************************************************

/**
 * Task to copy user and vendor scripts
 * for development.
 */
gulp.task('scripts:dev', function(callback) {
    return runSequence(
        'scripts-vendor:dev',
        'scripts-user:dev',
        callback);
});

// *****************************************************************************

/**
 * Task to copy the user scripts to the build
 * folder for development.
 */
gulp.task('scripts-user:dev', function() {
    return gulp
        .src([
            'client/libs/**/*.js',
            'client/client.js',
            'client/components/**/*.js'
        ])
        .pipe(flatten())
        .pipe(gulp.dest('build/dev/scripts/'));
});

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build
 * folder for development.
 */
gulp.task('scripts-vendor:dev', function() {
    return gulp
        .src([
            'build/vendor/angular/angular.js',
            'build/vendor/angular-sanitize/angular-sanitize.js',
            'build/vendor/bootstrap/bootstrap.js',
        ])
        .pipe(flatten())
        .pipe(gulp.dest('build/dev/scripts/vendor'));
});

// *****************************************************************************

gulp.task('scripts:prod',  function() {
    return gulp
        .src(arrScriptFilesExtended)
        .pipe(concat(strScriptsMinFileName))
        .pipe(sourcemaps.init())
        .pipe(cssnano({ discardComments: { removeAll: true } }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/prod/'));
});

// *****************************************************************************
// Basic tasks - vendor
// *****************************************************************************

/**
 * Task to delete all vendor files.
 */
gulp.task('vendor', function(callback) {
    return runSequence(
        'vendor:clean',
        'vendor:download',
        callback);
});

// *****************************************************************************

/**
 * Task to delete all vendor files.
 */
gulp.task('vendor:clean', function() {
    return del(['build/vendor/**/*']);
});

// *****************************************************************************

/**
 * Task to download vendor files into vendor folder
 * defined in "vendor.json" file.
 */
gulp.task('vendor:download', function(callback) {
    var streamWriteFile, objRequest;

    return async.forEachOf(vendor.dependencies, function(arrVendor, strFolder, _callbackOuter) {
        if (!arrVendor || arrVendor.length <= 0 || !strFolder) {
            return _callbackOuter();
        }

        return async.each(arrVendor, function(strVendorUrl, _callbackInner) {
            if (!strVendorUrl) {
                return _callbackInner();
            }

            return download(strVendorUrl)
                .pipe(gulp.dest('build/vendor/' + strFolder))
                .on('end', _callbackInner);

        }, _callbackOuter);
    }, callback);
});

// *****************************************************************************
// Basic tasks - server
// *****************************************************************************

/**
 * Task to start the server for development.
 */
gulp.task('server:dev', function(callback) {
    var server = exec('NODE_ENV=dev node server/server.js', function(objErr) {
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
// Executive tasks
// *****************************************************************************

/**
 * Task to build the dev files.
 */
gulp.task('build:dev', function(callback) {
    return runSequence(
        'clean:dev', [
            'scripts:dev',
            'styles:dev',
            'layout:dev',
            'templates',
        ], 
        callback);
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