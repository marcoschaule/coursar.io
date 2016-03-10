module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var del         = require('del');
var flatten     = require('gulp-flatten');
var runSequence = require('run-sequence');
var async       = require('async');
var download    = require('gulp-download');
var vendor      = require('../client/vendor.json');

// *****************************************************************************
// Basic tasks - vendor
// *****************************************************************************

/**
 * Task to delete all vendor files.
 */
gulp.task('vendor', callback => runSequence(
        'vendor:clean',
        'vendor:download',
        callback)
);

// *****************************************************************************

/**
 * Task to delete all vendor files.
 */
gulp.task('vendor:clean', () => del(['./.build/vendor/**/*']));

// *****************************************************************************

/**
 * Task to download vendor files into vendor folder
 * defined in "vendor.json" file.
 */
gulp.task('vendor:download', callback => {
    var streamWriteFile, objRequest;

    return async.forEachOf(vendor.dependencies, function(arrVendor, strFolder, _callbackOuter) {
        if (!arrVendor || arrVendor.length <= 0 || !strFolder) {
            return _callbackOuter();
        }

        return async.each(arrVendor, function(strVendorUrl, _callbackInner) {
            if (!strVendorUrl) {
                return _callbackInner();
            }

            return download(strVendorUrl)
                .pipe(gulp.dest('./.build/vendor/' + strFolder))
                .on('end', _callbackInner);

        }, _callbackOuter);
    }, callback);
});

// *****************************************************************************

};
