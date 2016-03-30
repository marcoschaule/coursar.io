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
        './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.styl', './admin/**/*.styl'
    ], ['styles:dev', 'styles:dev-admin']);
    
    // watch scripts changes
    gulp.watch([
        './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.js', './admin/**/*.js'
    ], ['scripts:dev', 'scripts:dev-admin']);
    
    // watch layout and template changes
    gulp.watch([
        './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.jade', './admin/**/*.jade'
    ], ['layout:dev', 'templates', 'layout:dev-admin', 'templates-admin']);
    
    // watch language changes
    gulp.watch([
        './gulpfile.js', './tasks/**/*.js', './package.json', './client/components/**/*.json', './admin/components/**/*.json'
    ], ['lang:dev', 'lang:dev-admin']);
    
    // watch static changes
    gulp.watch([
        './gulpfile.js', './tasks/**/*.js', './package.json', './server/**/*.static.jade', './client/**/*.static.jade', './admin/**/*.static.jade'
    ], ['statics:dev', 'statics:prod', 'statics:dev-admin', 'statics:prod-admin']);
    
    // watch asset changes
    gulp.watch([
        './assets/**/*'
    ], ['assets:dev', 'assets:dev-admin']);

    // watch server changes
    gulp.watch([
        './gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './server/**/*.js'
    ], ['server-express']);
});

// *****************************************************************************

/**
 * Task to watch development files.
 */
// gulp.task('watch:dev', () => {
    
//     // watch styles changes for client
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.styl'
//     ], ['styles:dev']);
    
//     // watch styles changes for admin
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './admin/**/*.styl'
//     ], ['styles:dev-admin']);
    
//     // watch scripts changes for client
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.js'
//     ], ['scripts:dev']);
    
//     // watch scripts changes for admin
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './admin/**/*.js'
//     ], ['scripts:dev-admin']);
    
//     // watch layout and template changes for client
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './client/**/*.jade'
//     ], ['layout:dev', 'templates']);
    
//     // watch layout and template changes for admin
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './admin/**/*.jade'
//     ], ['layout:dev-admin', 'templates-admin']);
    
//     // watch language changes for client
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './client/components/**/*.json'
//     ], ['lang:dev']);
    
//     // watch language changes for admin
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './admin/components/**/*.json'
//     ], ['lang:dev-admin']);
    
//     // watch static changes for client
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './server/**/*.static.jade', './client/**/*.static.jade'
//     ], ['statics:dev', 'statics:prod']);
    
//     // watch static changes for admin
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './server/**/*.static.jade', './admin/**/*.static.jade'
//     ], ['statics:dev-admin', 'statics:prod-admin']);

//     // watch asset changes for client
//     gulp.watch([
//         './assets/**/*'
//     ], ['assets:dev']);

//     // watch asset changes for admin
//     gulp.watch([
//         './assets/**/*'
//     ], ['assets:dev-admin']);
    
//     // watch server changes
//     gulp.watch([
//         './gulpfile.js', './tasks/**/*.js', './package.json', './assets/**/*', './server/**/*.js'
//     ], ['server-express']);
// });

// *****************************************************************************

};
