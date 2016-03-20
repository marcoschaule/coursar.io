module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var del = require('del');

// *****************************************************************************
// Basic tasks - clean
// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "strPathBuild + //dev" folder for development.
 */
gulp.task('clean:dev', () => {
    return del(['./.build/dev/**/*']);
});

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "strPathBuild + //prod" folder for production.
 */
gulp.task('clean:prod', () => {
    return del(['./.build/prod/**/*']);
});

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the server folder.
 */
gulp.task('clean:server', () => {
    return del(['./.build/server']);
});

// *****************************************************************************

};
