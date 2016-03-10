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
require('./tasks/watchers.js')(gulp);

// *****************************************************************************
// Executive tasks
// *****************************************************************************

/**
 * Task to build the development files.
 */
gulp.task('build:dev', callback => runSequence(
    ['clean:dev'],
    ['scripts:dev', 'styles:dev', 'fonts:dev', 'assets:dev', 'lang:dev', 'layout:dev', 'templates'],
    callback)
);

// *****************************************************************************

/**
 * Task to build the production files.
 */
gulp.task('build:prod', callback => runSequence(
    ['scripts:dev', 'styles:dev'],
    ['clean:prod', 'create:prod', 'fonts:prod', 'assets:prod', 'lang:prod'],
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
        ['build:dev'],
        ['watch:dev'],
        ['server-redis', 'server-mongodb', 'server-express'],
        callback);
});

// *****************************************************************************

/**
 * Default task.
 */
gulp.task('default', ['run:dev']);

// *****************************************************************************

})();