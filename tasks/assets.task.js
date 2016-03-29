module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var flatten = require('gulp-flatten');

// *****************************************************************************
// Basic tasks - assets
// *****************************************************************************

/**
 * Task to copy the assets to the ".build" folder for client development.
 */
_setupTaskForAssets('client');

// *****************************************************************************

/**
 * Task to copy the assets to the ".build" folder for admin development.
 */
_setupTaskForAssets('admin');

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function for setting up the tasks for assets.
 *
 * @private
 * @param {String} strWhich  string of which target to build for
 */
function _setupTaskForAssets(strWhich) {
    var strExt = 'admin' === strWhich ? '-admin' : '';
    
    gulp.task(`assets:dev${strExt}`, () => gulp
        .src(['./assets/**/*'])
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strExt}/assets/`)));
    gulp.task(`assets:prod${strExt}`, () => gulp
        .src(['./assets/**/*'])
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/prod${strExt}/assets/`)));    
}

// *****************************************************************************

};
