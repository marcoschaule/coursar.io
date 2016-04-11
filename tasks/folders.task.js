module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var childProcess = require('child_process');
var exec         = childProcess.exec;

// *****************************************************************************
// Basic tasks - create folders
// *****************************************************************************

/**
 * Task to create the folders necessary.
 */
gulp.task('create-folders', callback => exec('mkdir ./.uploads'));

// *****************************************************************************

};
