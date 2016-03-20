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
 * components folders for development.
 */
gulp.task('styles:dev', callback => runSequence(
    'styles-vendor:dev',
    'styles-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to build user CSS from stylus from layout and
 * components folders for development.
 */
gulp.task('styles-user:dev', () => gulp
    .src(['client/components/**/*.styl'])
    .pipe(stylus())
    .pipe(flatten())
    .pipe(autoprefixer({
        browsers: [autoPrefBrowserSupport],
        cascade : false,
    }))
    .pipe(gulp.dest('./.build/dev/styles/'))
);

// *****************************************************************************

/**
 * Task to build vendor CSS from stylus of the layout and
 * components folders for development.
 */
gulp.task('styles-vendor:dev', () => gulp
    .src(['./.build/vendor/**/*.css', '!./.build/vendor/**/*.min.css'])
    .pipe(gulpif(_testForFile('font-awesome'), replace(/..\/fonts/g, '../../fonts')))
    .pipe(flatten())
    .pipe(autoprefixer({
        browsers: [autoPrefBrowserSupport],
        cascade : false,
    }))
    .pipe(gulp.dest('./.build/dev/styles/vendor'))
);

// *****************************************************************************
// Helper functions
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
