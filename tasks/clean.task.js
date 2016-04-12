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
 * Task to delete all files and folders in the "dev" build folder.
 */
gulp.task('clean:dev', () => del(['./.build/dev/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in the "dev-admin" build folder.
 */
gulp.task('clean:dev-admin', () => del(['./.build/dev-admin/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in the "prod" build folder.
 */
gulp.task('clean:prod', () => del(['./.build/prod/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in the "prod-admin" build folder.
 */
gulp.task('clean:prod-admin', () => del(['./.build/prod-admin/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in the "prod-admin" build folder.
 */
gulp.task('clean:uploads', () => del(['./.uploads/**/*']));

// *****************************************************************************

/**
 * Task to delete all files and folders in
 * the server folder.
 */
// gulp.task('clean:server', () => del(['./.build/server']));

// *****************************************************************************

};
