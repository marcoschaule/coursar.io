(function() { 'use strict';

// *****************************************************************************
// Requires
// *****************************************************************************

var fs            = require('fs');
var path          = require('path');
var del           = require('del');
var exec          = require('child_process').exec;
var async         = require('async'); // TODO: delete

var gulp          = require('gulp');
var stylus        = require('gulp-stylus');
var jade          = require('gulp-jade');
var flatten       = require('gulp-flatten');
var concat        = require('gulp-concat');
var watch         = require('gulp-watch');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var cssnano       = require('gulp-cssnano');
var sourcemaps    = require('gulp-sourcemaps');
var domSrc        = require('gulp-dom-src'); // TODO: delete
var download      = require('gulp-download');
var gCallback     = require('gulp-callback'); // TODO: delete
var templateCache = require('gulp-angular-templatecache');
var runSequence   = require('run-sequence');

// *****************************************************************************
// Variables
// *****************************************************************************

var regexStyles               = new RegExp('link\\(rel="stylesheet", href="(.*)"\\)', 'gi');
var regexStylesBlock          = new RegExp('\/\/- #begin styles(.|\n)*\/\/- #end styles\n');
var regexScriptsBlock         = new RegExp('\/\/- #begin scripts(.|\n)*\/\/- #end scripts\n');
var strStylesTag              = 'link(rel="stylesheet", href="styles.css")';
var strScriptsTag             = 'link(rel="stylesheet", href="scripts.js")';

var strPathScriptsUser        = path.join(__dirname, 'build/dev/scripts/');
var strPathScriptsVendor      = path.join(__dirname, 'build/dev/scripts/vendor/');
var strPathStylesUser         = path.join(__dirname, 'build/dev/styles/');
var strPathStylesVendor       = path.join(__dirname, 'build/dev/styles/vendor/');
var strTemplateChacheFileName = 'templates.js';

var objTemplateCacheSettings  = {
    module: 'cou-templates'
};

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
        .pipe(replace(regexStylesBlock, strStylesTag))
        .pipe(replace(regexScriptsBlock, strScriptsTag))
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
        .pipe(flatten())
        .pipe(templateCache(strTemplateChacheFileName, objTemplateCacheSettings))
        .pipe(gulp.dest('build/dev/scripts/'));
});

// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for development.
 */
gulp.task('styles-user:dev', function(callback) {
    return runSequence(
        'styles-user:dev',
        'styles-vendor:dev',
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
gulp.task('styles-bootstrap:dev', function() {
    // return gulp
    //     .src([
    //         'node_modules/bootstrap-styl/bootstrap/variables.styl',
    //         'node_modules/bootstrap-styl/bootstrap/mixins/*.styl',
    //         'node_modules/bootstrap-styl/bootstrap/*.styl',
    //     ])
    //     .pipe(concat('bootstrap.styl'))
    //     .pipe(stylus())
    //     // .pipe(flatten())
    //     .pipe(gulp.dest('build/dev/styles/vendor/'));
});

// *****************************************************************************

/**
 * Task to build css from stylus from layout and
 * components folders for production.
 */
gulp.task('styles:prod', ['styles:dev'], function() {
    var strSrcFilePath = 'client/layout/layout.jade';
    var arrFiles       = [];
    var arrMatch, strFileContent, strFileMatch;

    return fs.readFile(strSrcFilePath, function(objErr, strFileBuffer) {
        strFileContent = strFileBuffer.toString();

        while ((arrMatch = regexStyles.exec(strFileContent)) !== null) {
            strFileMatch = path.join('build/dev/', arrMatch[1]); 
            arrFiles.push(strFileMatch);
        }

        return gulp
            .src(arrFiles)
            .pipe(concat('styles.css'))
            .pipe(sourcemaps.init())
            .pipe(cssnano())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('build/prod/'));
    });
});

// *****************************************************************************

/**
 * Task to copy the user scripts to the build
 * folder for development.
 */
gulp.task('scripts-user:dev', function() {
    return gulp
        .src(['client/components/**/*.js'])
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
            'node_modules/angular/angular.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
        ])
        .pipe(flatten())
        .pipe(gulp.dest('build/dev/scripts/vendor/'));
});

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
// Common tasks
// *****************************************************************************

/**
 * Task to build the dev files.
 */
gulp.task('build:dev', function(callback) {
    return runSequence('clean:dev', [
        'scripts-vendor:dev',
        'scripts-user:dev',
        'styles:dev',
        'layout:dev',
        'templates',
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