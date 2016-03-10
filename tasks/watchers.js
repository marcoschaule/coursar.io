module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Watchers
// *****************************************************************************

/**
 * Task to watch development files.
 */
gulp.task('watch:dev', () => {
    gulp.watch(['./gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './client/**/*.styl'], ['styles:dev']);
    gulp.watch(['./gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './client/**/*.js'],   ['scripts:dev']);
    gulp.watch(['./gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './client/**/*.jade'], ['layout:dev', 'templates']);
    gulp.watch(['./gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './server/**/*.js'],   ['server-express']);
    gulp.watch(['./gulpfile.js', './tasks/**/*.js', './package.json', './client/components/**/*.json'],   ['lang:dev']);
});

// *****************************************************************************

};
