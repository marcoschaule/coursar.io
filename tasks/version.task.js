module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var bump       = require('gulp-bump');
var git        = require('gulp-git');
var filter     = require('gulp-filter');
var tagVersion = require('gulp-tag-version');

// *****************************************************************************
// Version bumping and git management
// *****************************************************************************

/**
 * Tasks to bump a version by patch, feature or release (semver).
 */
gulp.task('bump:patch',   () => bumpVersion('patch'));
gulp.task('bump:feature', () => bumpVersion('minor'));
gulp.task('bump:release', () => bumpVersion('major'));

// *****************************************************************************

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp bump:patch     # makes v0.1.0 → v0.1.1
 *     gulp bump:feature   # makes v0.1.1 → v0.2.0
 *     gulp bump:release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function bumpVersion(strImportance) {
    // get all the files to bump version in 
    return gulp.src(['./package.json'])
        // bump the version number in those files 
        .pipe(bump({ type: strImportance }))
        // save it back to filesystem 
        .pipe(gulp.dest('./'))
        // commit the changed version number 
        .pipe(git.commit('Bump package version'))
        // read only one file to get the version number 
        .pipe(filter('package.json'))
        // **tag it in the repository** 
        .pipe(tagVersion());
}

// *****************************************************************************

};
