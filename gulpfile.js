(() => { 'use strict';

// *****************************************************************************
// Requires
// *****************************************************************************

var gulp        = require('gulp');
var runSequence = require('run-sequence');

// *****************************************************************************
// Variables
// *****************************************************************************

global.env  = 'prod';
global.port = 3000;

// *****************************************************************************
// Load external subtasks
// *****************************************************************************

require('./tasks/lint.task.js')(gulp);
require('./tasks/clean.task.js')(gulp);
require('./tasks/assets.task.js')(gulp);
require('./tasks/templates.task.js')(gulp);
require('./tasks/styles.task.js')(gulp);
require('./tasks/scripts.task.js')(gulp);
require('./tasks/language.task.js')(gulp);
require('./tasks/fonts.task.js')(gulp);
require('./tasks/production.task.js')(gulp);
require('./tasks/vendor.task.js')(gulp);
require('./tasks/servers.task.js')(gulp);
require('./tasks/version.task.js')(gulp);
require('./tasks/tests.task.js')(gulp);
require('./tasks/folders.task.js')(gulp);
require('./tasks/watchers.js')(gulp);

// *****************************************************************************
// Executive tasks
// *****************************************************************************

/**
 * Task to build the development files.
 */
gulp.task('build:dev', callback => runSequence(
    // ['lint:js', 'lint:json'],
    ['clean:dev'],
    ['layout:dev', 'scripts:dev', 'styles:dev', 'fonts:dev', 'assets:dev', 'lang:dev', 'templates', 'statics:dev'],
    callback
));

// *****************************************************************************

/**
 * Task to build the development files.
 */
gulp.task('build:dev-admin', callback => runSequence(
    // ['lint:js', 'lint:json'],
    ['clean:dev-admin'],
    ['layout:dev-admin', 'scripts:dev-admin', 'styles:dev-admin', 'fonts:dev-admin', 'assets:dev-admin', 'lang:dev-admin', 'templates-admin', 'statics:dev-admin'],
    callback
));

// *****************************************************************************

/**
 * Task to build the production files.
 */
gulp.task('build:prod', callback => runSequence(
    // ['lint:js', 'lint:json'],
    ['layout:dev', 'scripts:dev', 'styles:dev'],
    ['clean:prod', 'create:prod'],
    ['fonts:prod', 'assets:prod', 'statics:prod'],
    callback
));

// *****************************************************************************

/**
 * Task to build the production files.
 */
gulp.task('build:prod-admin', callback => runSequence(
    // ['lint:js', 'lint:json'],
    ['layout:dev-admin', 'scripts:dev-admin', 'styles:dev-admin'],
    ['clean:prod-admin', 'create:prod-admin'],
    ['fonts:prod-admin', 'assets:prod-admin', 'statics:prod-admin'],
    callback
));

// *****************************************************************************

/**
 * Task to test and cover the application.
 */
gulp.task('cover', callback => runSequence(
    ['cover:server'],
    callback
));

// *****************************************************************************

/**
 * Task to run all development tasks.
 */
gulp.task('run:dev', callback => {
    global.env  = 'dev';
    global.port = 3000;

    return runSequence(
        ['build:dev', 'build:dev-admin'],
        ['watch:dev'],
        ['server-redis', 'server-mongodb', 'server-express'],
        callback);
});

// *****************************************************************************

/**
 * Task to run all development tasks.
 */
gulp.task('run:prod', callback => {
    global.env  = 'prod';
    global.port = 3000;

    return runSequence(
        ['build:prod'],
        ['server-redis', 'server-mongodb', 'server-express'],
        callback);
});

// *****************************************************************************

/**
 * Default tasks.
 */
gulp.task('default', ['run:dev']);
gulp.task('dev',     ['run:dev']);
gulp.task('prod',    ['run:prod']);

// *****************************************************************************

})();