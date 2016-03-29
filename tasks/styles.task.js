module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var runSequence  = require('run-sequence');
var stylus       = require('gulp-stylus');
var gulpif       = require('gulp-if');
var replace      = require('gulp-replace');
var flatten      = require('gulp-flatten');
var autoprefixer = require('gulp-autoprefixer');

var autoPrefBrowserSupport = 'last 5 versions';

// *****************************************************************************
// Basic tasks - styles
// *****************************************************************************

/**
 * Task to build CSS from stylus from layout and
 * components folders for client development.
 */
gulp.task('styles:dev', callback => runSequence(
    'styles-vendor:dev',
    'styles-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to build CSS from stylus from layout and
 * components folders for admin development.
 */
gulp.task('styles:dev-admin', callback => runSequence(
    'styles-vendor:dev-admin',
    'styles-user:dev-admin',
    callback)
);

// *****************************************************************************

/**
 * Task to build user CSS from stylus from layout and
 * components folders for client development.
 */
_setupTaskForUserStyles('client');

// *****************************************************************************

/**
 * Task to build user CSS from stylus from layout and
 * components folders for admin development.
 */
_setupTaskForUserStyles('admin');

// *****************************************************************************

/**
 * Task to build vendor CSS from stylus of the layout and
 * components folders for client development.
 */
_setupTaskForVendorStyles('client');

// *****************************************************************************

/**
 * Task to build vendor CSS from stylus of the layout and
 * components folders for admin development.
 */
_setupTaskForVendorStyles('admin');

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task to create user styles.
 *
 * @private
 * @param {String} strWhich  string of which target to build for
 */
function _setupTaskForUserStyles(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';

    gulp.task(`styles-user:dev${strExt}`, () => gulp
        .src([`${strWhich}/components/**/*.styl`])
        .pipe(stylus())
        .pipe(flatten())
        .pipe(autoprefixer({
            browsers: [autoPrefBrowserSupport],
            cascade : false,
        }))
        .pipe(gulp.dest(`./.build/dev${strExt}/styles/`))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task to create vendor styles.
 *
 * @private
 * @param {String} strWhich  string of which target to build for
 */
function _setupTaskForVendorStyles(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';

    gulp.task(`styles-vendor:dev${strExt}`, () => gulp
        .src([
            `./.build/vendor${strExt}/**/*.css`,
            `!./.build/vendor${strExt}/**/*.min.css`
        ])
        .pipe(gulpif(_testForFile('font-awesome'), replace(/..\/fonts/g, '../../fonts')))
        .pipe(flatten())
        .pipe(autoprefixer({
            browsers: [autoPrefBrowserSupport],
            cascade : false,
        }))
        .pipe(gulp.dest(`./.build/dev${strExt}/styles/vendor`))
    );
}

// *****************************************************************************

/**
 * Helper function to test if a file is within the pipeline.
 * 
 * @private
 * @param  {String}  strFileName  string of the file name
 * @return {Boolean}              true if the file was found
 */
function _testForFile(strFileName) {
    return function(objFile) {
        if (objFile.path.indexOf(strFileName) >= 0) {
            return true;
        }
        return false;
    };
}

// *****************************************************************************

};
