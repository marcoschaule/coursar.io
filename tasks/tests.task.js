module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var istanbul = require('gulp-istanbul');
var mocha    = require('gulp-mocha');

// *****************************************************************************
// Basic tasks - server tests
// *****************************************************************************

/**
 * Task to prepare server testing by loading all files.
 */
gulp.task('pre-test:server', () => gulp
    // load all server files to be tested if required by test files
    .src(['./server/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire())
);

// *****************************************************************************

/**
 * Task to test server files.
 */
gulp.task('test:server', ['pre-test:server'], () => gulp
    // just start server tests
    .src(['./tests/server-tests.js'])
    // use mocha reporter
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 50 } }))
);

// *****************************************************************************

};
