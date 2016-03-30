module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs          = require('fs');
var path        = require('path');
var async       = require('async');
var through     = require('through2');
var runSequence = require('run-sequence');
var flatten     = require('gulp-flatten');
var gulpif      = require('gulp-if');

// *****************************************************************************
// Basic tasks - scripts
// *****************************************************************************

/**
 * Task to copy user and vendor scripts for client development.
 */
gulp.task('scripts:dev', callback => runSequence(
    'scripts-vendor:dev',
    'scripts-user:dev',
    callback)
);

// *****************************************************************************

/**
 * Task to copy user and vendor scripts for admin development.
 */
gulp.task('scripts:dev-admin', callback => runSequence(
    'scripts-vendor:dev-admin',
    'scripts-user:dev-admin',
    callback)
);

// *****************************************************************************

/**
 * Task to copy the user scripts to the build folder for client development.
 */
_setupTaskScriptsUser(false);

// *****************************************************************************

/**
 * Task to copy the user scripts to the build folder for admin development.
 */
_setupTaskScriptsUser(true);

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build folder for client development.
 */
_setupTaskScriptsVendor(false);

// *****************************************************************************

/**
 * Task to copy the vendor scripts to the build folder for admin development.
 */
_setupTaskScriptsVendor(true);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task to create the user scripts.
 *
 * @private
 * @param {Boolean} isAdmin  true if to build the admin user scripts
 */
function _setupTaskScriptsUser(isAdmin) {
    var strWhich    = isAdmin ? 'admin'  : 'client';
    var strAdminExt = isAdmin ? '-admin' : '';

    gulp.task(`scripts-user:dev${strAdminExt}`, () => gulp
        .src([
            `!${strWhich}/**/*.include.js`,
             `${strWhich}/libs/**/*.js`,
             `${strWhich}/${strWhich}.js`,
             `${strWhich}/components/**/*.js`,
        ])
        .pipe(through.obj(_renderRequireInFile))
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strAdminExt}/scripts/`))
    );
}

// *****************************************************************************

/**
 * Helper function to setup the task to create the vendor scripts.
 *
 * @private
 * @param {Boolean} isAdmin  true if to build the admin vendor scripts
 */
function _setupTaskScriptsVendor(isAdmin) {
    var strAdminExt = isAdmin ? '-admin' : '';

    gulp.task(`scripts-vendor:dev${strAdminExt}`, () => gulp
        .src([
             `./.build/vendor${strAdminExt}/**/*.js`,
            `!./.build/vendor${strAdminExt}/**/*.min.js`])
        .pipe(flatten())
        .pipe(gulp.dest(`./.build/dev${strAdminExt}/scripts/vendor`))
    );
}

// *****************************************************************************

/**
 * Helper function to render a "require" term in script files and replace the
 * match with the content of the file.
 *
 * @private
 * @param {Object}   objFile      object of the current file
 * @param {string}   strEncoding  string of the current file's encoding
 * @param {Function} callback     function for callback
 */
function _renderRequireInFile(objFile, strEncoding, callback) {
    var regexRequire   = /require\([\'|\"](.*)[\'|\"]\);/gmi;
    var regexIIFEBegin = /^(\/\*\*([^*]|(\*+[^*/]))*\*+\/)?\s*\(function\(.*\)\s*\{\s*[\'|\"]use strict[\'|\"]\s*;/gi;
    var regexIIFEEnd   = /\}\)\(.*\);(\s)*$/gi;
    var strContent     = String(objFile.contents)+'';
    var arrMatches, strMatch, strPath;

    return async.whilst(

        // test
        function() {
            return (arrMatches = regexRequire.exec(strContent)) !== null;
        },

        // action
        function(_callback) {
            strMatch = arrMatches[0];
            strPath  = path.join(path.dirname(objFile.path), arrMatches[1]);

            try {

                return fs.readFile(strPath, function(objErr, strContent2) {
                    if (objErr) {
                        throw new Error(objErr);
                    }

                    strContent2 = strContent2 && 
                            String(strContent2);
                    strContent2 = strContent2 &&
                            'function' === typeof strContent2.replace &&
                            strContent2.replace(regexIIFEBegin, '');
                    strContent2 = strContent2 &&
                            'function' === typeof strContent2.replace &&
                            strContent2.replace(regexIIFEEnd, '');
                    strContent = strContent.replace(strMatch, strContent2.trim());

                    return _callback(null);
                });

            } catch (objErr) {
                console.error(objErr);
                strContent = strContent.replace(strMatch, '');
                return _callback(null);
            }
        },

        // callback
        function(objErr) {
            if (objErr) {
                console.error(objErr);
                return callback(null, objFile);
            }
            objFile.contents = new Buffer(strContent);
            return callback(null, objFile);
        }
    );
}

// *****************************************************************************

};
