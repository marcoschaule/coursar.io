module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var runSequence = require('run-sequence');
var flatten     = require('gulp-flatten');
var gulpif      = require('gulp-if');

// *****************************************************************************
// Basic tasks - scripts
// *****************************************************************************

/**
 * Task to copy user and vendor scripts for client development.
 */
gulp.task('scripts:dev', callback => runSequence(
    'scripts-vendor:dev',
    'scripts-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to copy user and vendor scripts for admin development.
 */
gulp.task('scripts:dev-admin', callback => runSequence(
    'scripts-vendor:dev-admin',
    'scripts-user:dev-admin',
    callback)
);

// *****************************************************************************

/**
 * Task to copy the user scripts to the build folder for client development.
 */
_setupTaskScriptsUser(false);

// *****************************************************************************

/**
 * Task to copy the user scripts to the build folder for admin development.
 */
_setupTaskScriptsUser(true);

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build folder for client development.
 */
_setupTaskScriptsVendor(false);

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build folder for admin development.
 */
_setupTaskScriptsVendor(true);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task to create the user scripts.
 *
 * @private
 * @param {Boolean} isAdmin  true if to build the admin user scripts
 */
function _setupTaskScriptsUser(isAdmin) {
    var strWhich    = isAdmin ? 'admin'  : 'client';
    var strAdminExt = isAdmin ? '-admin' : '';

    gulp.task(`scripts-user:dev${strAdminExt}`, () => gulp
        .src([
            `${strWhich}/libs/**/*.js`,
            `${strWhich}/${strWhich}.js`,
            `${strWhich}/components/**/*.js`,
        ])
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strAdminExt}/scripts/`))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task to create the vendor scripts.
 *
 * @private
 * @param {Boolean} isAdmin  true if to build the admin vendor scripts
 */
function _setupTaskScriptsVendor(isAdmin) {
    var strAdminExt = isAdmin ? '-admin' : '';

    gulp.task(`scripts-vendor:dev${strAdminExt}`, () => gulp
        .src([
             `./.build/vendor${strAdminExt}/**/*.js`,
            `!./.build/vendor${strAdminExt}/**/*.min.js`])
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strAdminExt}/scripts/vendor`))
    );
}

// *****************************************************************************

};
