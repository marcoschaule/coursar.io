module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var jade          = require('gulp-jade');
var jshint        = require('gulp-jshint');
var stylish       = require('jshint-stylish');
var jsonlint      = require("gulp-jsonlint");
var validatorHTML = require('gulp-w3cjs');

var _jsHintReporter = 'jshint-stylish';

// *****************************************************************************
// Basic tasks - JavaScript linters
// *****************************************************************************

/**
 * Task to lint all JavaScript files.
 */
gulp.task('lint:js', ['lint:js:client', 'lint:js:admin', 'lint:js:server']);

// *****************************************************************************

/**
 * Task to lint all client side JavaScript files.
 */
_setupTaskLintJS('client');

// *****************************************************************************

/**
 * Task to lint all admin side JavaScript files.
 */
_setupTaskLintJS('admin');

// *****************************************************************************

/**
 * Task to lint all server side JavaScript files.
 */
_setupTaskLintJS('server');

// *****************************************************************************
// Basic tasks - JSON linters
// *****************************************************************************

/**
 * Task to lint all JSON files.
 */
gulp.task('lint:json', ['lint:json:client', 'lint:json:server']);

// *****************************************************************************

/**
 * Task to lint all client side JSON files.
 */
_setupTaskLintJson('client');

// *****************************************************************************

/**
 * Task to lint all admin side JSON files.
 */
_setupTaskLintJson('admin');

// *****************************************************************************

/**
 * Task to lint all server side JSON files.
 */
_setupTaskLintJson('server');

// *****************************************************************************
// Basic tasks - HTML validators
// *****************************************************************************

/**
 * Task to validate the HTML of all jade files.
 */
gulp.task('validate:html', () => gulp
    .src([
        './client/components/layout/layout.jade',
        './client/**/*.template.jade',
        './server/**/*.jade',
    ])
    .pipe(jade())
    .pipe(validatorHTML({
        doctype: 'HTML5', // Defaults false for autodetect
        charset: 'utf-8', // Defaults false for autodetect
    }))
    // .pipe(validatorHTML.reporter())
);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task to lint all JS files in given folder.
 *
 * @private
 * @param {String} strWhich  string of which folder to be used
 */
function _setupTaskLintJS(strWhich) {
    gulp.task(`lint:js:${strWhich}`, () => gulp
        .src(`./${strWhich}/**/*.js`)
        .pipe(jshint())
        .pipe(jshint.reporter(_jsHintReporter))
        .pipe(jshint.reporter('fail'))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task to lint all JSON files in given folder.
 *
 * @private
 * @param {String} strWhich  string of which folder to be used
 */
function _setupTaskLintJson(strWhich) {
    gulp.task(`lint:json:${strWhich}`, () => gulp
        .src(`./${strWhich}/**/*.json`)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter())
    );
}

// *****************************************************************************

};
