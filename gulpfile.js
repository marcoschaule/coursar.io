(() => { 'use strict';

// *****************************************************************************
// Requires
// *****************************************************************************

var fs            = require('fs');
var path          = require('path');
var del           = require('del');
var childProcess  = require('child_process');
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
var git           = require('gulp-git');
var bump          = require('gulp-bump');
var filter        = require('gulp-filter');
var tagVersion    = require('gulp-tag-version');
var templateCache = require('gulp-angular-templatecache');
var runSequence   = require('run-sequence');

var vendor        = require('./client/vendor.json');

var exec          = childProcess.exec;
var spawn         = childProcess.spawn;

// *****************************************************************************
// Variables
// *****************************************************************************

var regexStylesReplacer       = new RegExp('<\\!--\\s*\\{styles\}\\s*--\\>');
var regexScriptsReplacer      = new RegExp('<\\!--\\s*\\{scripts\}\\s*--\\>');

// *****************************************************************************

var strTemplateChacheFileName = 'templates.js';
var strStylesMinFileName      = 'styles.min.css';
var strScriptsMinFileName     = 'scripts.min.js';
var strStylesTag              = '<link rel="stylesheet" href="{path}"></link>';
var strScriptsTag             = '<script type="text/javascript" src="{path}"></script>';
var strPathScriptsUser        = path.join(__dirname, 'build/dev/scripts/');
var strPathScriptsVendor      = path.join(__dirname, 'build/dev/scripts/vendor/');
var strPathStylesUser         = path.join(__dirname, 'build/dev/styles/');
var strPathStylesVendor       = path.join(__dirname, 'build/dev/styles/vendor/');

// *****************************************************************************

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

var env  = 'prod';
var port = 3001;
var serverExpress, serverRedis;

// *****************************************************************************
// Basic tasks - clean
// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "/build/dev" folder for development.
 */
gulp.task('clean:dev', () => {
    return del(['build/dev/**/*']);
});

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "/build/prod" folder for production.
 */
gulp.task('clean:prod', () => {
    return del(['build/prod/**/*']);
});

// *****************************************************************************
// Basic tasks - layout and templates
// *****************************************************************************

/**
 * Task to build the layout HTML file for development.
 */
gulp.task('layout:dev', () => {
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
gulp.task('layout:prod', () => {
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
gulp.task('templates', () => {
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
gulp.task('styles:dev', (callback) => {
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
gulp.task('styles-user:dev', () => {
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
gulp.task('styles-vendor:dev', () => {
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
gulp.task('styles:prod', ['styles:dev'], () => {
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
gulp.task('scripts:dev', (callback) => {
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
gulp.task('scripts-user:dev', () => {
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
gulp.task('scripts-vendor:dev', () => {
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

gulp.task('scripts:prod',  () => {
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
gulp.task('vendor', (callback) => {
    return runSequence(
        'vendor:clean',
        'vendor:download',
        callback);
});

// *****************************************************************************

/**
 * Task to delete all vendor files.
 */
gulp.task('vendor:clean', () => {
    return del(['build/vendor/**/*']);
});

// *****************************************************************************

/**
 * Task to download vendor files into vendor folder
 * defined in "vendor.json" file.
 */
gulp.task('vendor:download', (callback) => {
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
// Basic tasks - servers
// *****************************************************************************

/**
 * Task to start the Redis server.
 * 
 * spanw version: "serverRedis = spawn('redis-server');"
 */
gulp.task('server-redis', (callback) => {
    if (serverRedis && 'function' === typeof serverRedis.kill) {
        serverRedis.kill();
    }
    serverRedis = exec('redis-server', (objErr) => {
        return ('function' === typeof callback && callback(objErr));
    });
    serverRedis.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
    serverRedis.on('exit', () => {
        console.log('Redis killed!');
    });
});

// *****************************************************************************

/**
 * Task to start the Express server
 * 
 * spawn version: "serverExpress = spawn('node', ['server/server.js'], { NODE_ENV: env, PORT: port });"
 */
gulp.task('server-express', (callback) => {
    if (serverExpress && 'function' === typeof serverExpress.kill) {
        serverExpress.kill();
    }
    serverExpress = exec('NODE_ENV=${env} PORT=${port} nodemon server/server.js', (objErr) => {
        return ('function' === typeof callback && callback(objErr));
    });
    serverExpress.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
    serverExpress.on('exit', () => {
        console.log('Express killed!');
    });
});

// *****************************************************************************
// Watchers
// *****************************************************************************

/**
 * Task to watch development files.
 */
gulp.task('watch:dev', () => {
    gulp.watch('client/**/*.styl', ['styles:dev']);
    gulp.watch('client/**/*.js',   ['scripts:dev']);
    gulp.watch('client/**/*.jade', ['layout:dev', 'templates']);
    gulp.watch('server/**/*.js',   ['server-express']);
});

// *****************************************************************************
// Executive tasks
// *****************************************************************************

/**
 * Task to build the dev files.
 */
gulp.task('build:dev', (callback) => {
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
gulp.task('run:dev', (callback) => {
    env  = 'dev';
    port = 3000;

    return runSequence(
        'build:dev',
        'watch:dev',
        ['server-redis', 'server-express'],
        callback);
});

/**
 * Default task.
 */
gulp.task('default', []);

// *****************************************************************************
// Version bumping and git management
// *****************************************************************************

/**
 * Tasks to bump a version by patch, feature or release (semver).
 */
gulp.task('bump:patch',   function() { return bumpVersion('patch'); });
gulp.task('bump:feature', function() { return bumpVersion('minor'); });
gulp.task('bump:release', function() { return bumpVersion('major'); });

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function bumpVersion(strImportance) {
    // get all the files to bump version in 
    return gulp.src(['./package.json'])
        // bump the version number in those files 
        .pipe(bump({ type: strImportance }))
        // save it back to filesystem 
        .pipe(gulp.dest('./'))
        // commit the changed version number 
        .pipe(git.commit('Bump package version'))
        // read only one file to get the version number 
        .pipe(filter('package.json'))
        // **tag it in the repository** 
        .pipe(tagVersion());
}
 
// *****************************************************************************

})();