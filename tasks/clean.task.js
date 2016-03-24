module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var del = require('del');

// *****************************************************************************
// Basic tasks - clean
// *****************************************************************************

/**
 * Task to clean development and production.
 */
gulp.task('clean', ['clean:dev', 'clean:prod']);

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "strPathBuild + //dev" folder for development.
 */
gulp.task('clean:dev', () => del(['./.build/dev/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the "strPathBuild + //prod" folder for production.
 */
gulp.task('clean:prod', () => del(['./.build/prod/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the server folder.
 */
gulp.task('clean:server', () => del(['./.build/server']));

// *****************************************************************************

};
