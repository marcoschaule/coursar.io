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
gulp.task('lint:js', ['lint:js:client', 'lint:js:server']);

// *****************************************************************************

/**
 * Task to lint all client side JavaScript files.
 */
gulp.task('lint:js:client', () => gulp
    .src('./client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(_jsHintReporter))
    .pipe(jshint.reporter('fail'))
);

// *****************************************************************************

/**
 * Task to lint all server side JavaScript files.
 */
gulp.task('lint:js:server', () => gulp
    .src('./server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(_jsHintReporter))
    .pipe(jshint.reporter('fail'))
);

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
gulp.task('lint:json:client', () => gulp
    .src('./client/**/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
);

// *****************************************************************************

/**
 * Task to lint all server side JSON files.
 */
gulp.task('lint:json:server', () => gulp
    .src('./server/**/*.json')
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
);

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

};
