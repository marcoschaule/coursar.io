module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var del            = require('del');
var flatten        = require('gulp-flatten');
var runSequence    = require('run-sequence');
var async          = require('async');
var download       = require('gulp-download');
var rename         = require('gulp-rename');

var objVendor      = require('../client/vendor.json');
var objVendorAdmin = require('../admin/vendor.json');

// *****************************************************************************
// Basic tasks - vendor
// *****************************************************************************

/**
 * Task to delete all vendor files and then rebuild them in the
 * user vendor build folder.
 */
gulp.task('vendor', callback => runSequence(
        'vendor-client',
        'vendor-admin',
        callback)
);

// *****************************************************************************

/**
 * Task to delete all client vendor files and then rebuild them in the
 * user vendor build folder.
 */
gulp.task('vendor-client', callback => runSequence(
        'vendor:clean',
        'vendor:download',
        callback)
);

// *****************************************************************************

/**
 * Task to delete all admin vendor files and then rebuild them in the
 * user vendor build folder.
 */
gulp.task('vendor-admin', callback => runSequence(
        'vendor-admin:clean',
        'vendor-admin:download',
        callback)
);

// *****************************************************************************

/**
 * Task to delete all vendor files from the user vendor build folder.
 */
gulp.task('vendor:clean', () => del(['./.build/vendor/**/*']));

// *****************************************************************************

/**
 * Task to delete all vendor files from the user vendor build folder.
 */
gulp.task('vendor-admin:clean', () => del(['./.build/vendor-admin/**/*']));

// *****************************************************************************

/**
 * Task to download vendor files into the user build vendor folder
 * defined in "vendor.json" file.
 */
_setupTaskVendorDownload(false);

// *****************************************************************************

/**
 * Task to download vendor files into the admin build vendor folder
 * defined in "vendor.json" file.
 */
_setupTaskVendorDownload(true);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to setup the task to download the vendor files for
 * user and admin builds.
 *
 * @private
 * @param {Boolean} isAdmin  true if to build the admin vendor folder
 */
function _setupTaskVendorDownload(isAdmin) {
    var strName = isAdmin ? 'vendor-admin:download'     : 'vendor:download';
    var strDest = isAdmin ? './.build/vendor-admin/'    : './.build/vendor/';
    var objDeps = isAdmin ? objVendorAdmin.dependencies : objVendor.dependencies;

    gulp.task(strName, callback => {
        var streamWriteFile, objRequest;

        return async.forEachOf(objDeps, function(arrVendor, strFolder, _callbackOuter) {
            if (!arrVendor || arrVendor.length <= 0 || !strFolder) {
                return _callbackOuter();
            }
            return async.each(arrVendor, function(objVendor, _callbackInner) {
                if (!objVendor || !objVendor.file) {
                    return _callbackInner();
                }
                var objStream = download(objVendor.file);

                // rename if necessary                    
                if (objVendor.rename) {
                    objStream.pipe(rename(objVendor.rename));
                }

                return objStream
                    .pipe(gulp.dest(strDest + strFolder))
                    .on('end', _callbackInner);

            }, _callbackOuter);
        }, callback);
    });
}

// *****************************************************************************


};
