module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Watchers
// *****************************************************************************

/**
 * Task to watch development files.
 */
gulp.task('watch:dev', () => {
    
    // watch styles changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './client/**/*.styl'
    ], ['styles:dev']);
    
    // watch scripts changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './client/**/*.js'
    ], ['scripts:dev']);
    
    // watch layout and template changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './client/**/*.jade'
    ], ['layout:dev', 'templates']);
    
    // watch static changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './**/*.static.jade'
    ], ['statics:dev', 'statics:prod']);
    
    // watch language changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './client/components/**/*.json'
    ], ['lang:dev']);
    
    // watch asset changes
    gulp.watch([
        './assets/**/*',
    ], ['assets:dev']);
    
    // watch server changes
    gulp.watch([
        './gulpfile.js',
        './tasks/**/*.js',
        './package.json',
        './assets/**/*', './server/**/*.js'
    ], ['server-express']);
});

// *****************************************************************************

};
