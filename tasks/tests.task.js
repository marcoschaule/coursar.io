module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var del      = require('del');
var istanbul = require('gulp-istanbul');
var mocha    = require('gulp-mocha');

var objOptionsMocha = {
    reporter        : 'spec',
    ui              : 'bdd',
};
var objOptionsReports = {
    dir             : './.coverage',
    reportOpts      : { dir: './.coverage' },
};
var objOptionsThresholds = {
    thresholds      : { global: 10 },
};

// *****************************************************************************
// Basic tasks - server tests
// *****************************************************************************

/**
 * Task to run the Mocha test against the server.
 */
gulp.task('test:server', () => gulp
    .src('./tests/server-tests.js', { read: false })
    .pipe(mocha(objOptionsMocha))
);

// *****************************************************************************

/**
 * Task to clean the coverage folder.
 */
gulp.task('pre-cover:clean', () => del(['./.coverage']));

// *****************************************************************************

/**
 * Task to prepare server coverage testing by loading all files.
 */
gulp.task('pre-cover:server', () => gulp
    // load all server files to be tested if required by test files
    .src(['./server/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire())
);

// *****************************************************************************

/**
 * Task to test cover server files.
 */
gulp.task('cover:server', ['pre-cover:clean', 'pre-cover:server'], () => gulp
    // just start server tests
    .src(['./tests/server-tests.js'])
    // use mocha reporter
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports(objOptionsReports))
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds(objOptionsThresholds))
);

// *****************************************************************************

};
