(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var multer = require('multer');
var moment = require('moment');
var clone  = require('clone');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.settingsWithStorage = settingsWithStorage;

// *****************************************************************************
// Library functions
// *****************************************************************************

/**
 * Library function to get the settings with the storage attribute.
 *
 * @public
 * @return {Object}  object of the transformed settings
 */
function settingsWithStorage() {
    var objSettingsLocal = clone(settings.upload);

    // set the storage path to the destination path
    objSettingsLocal.storage = _storage(objSettingsLocal.dest);

    // delete the destination path since storage is used
    delete objSettingsLocal.dest;

    return objSettingsLocal;
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to create multer storage object for special storage destination.
 *
 * @private
 * @param  {String} strUrl  string of the URL the files should be stored in
 * @return {Object}         object of the multer storage
 */
function _storage(strUrl) {
    var objStorage = multer.diskStorage({
        destination: function(req, objFile, callback) {
            return callback(null, strUrl);
        },
        filename: function(req, objFile, callback) {
            return callback(null, _makefileName(objFile.originalname));
        }
    });
    return objStorage;
}

/**
 * Helper function to make the file name by prefixing it with the current date.
 *
 * @private
 * @param  {String} strNameSource  string of the file name source
 * @return {String}                string of the file name target
 */
function _makefileName(strNameSource) {
    var strNameEncoded = _encodeName(strNameSource);
    var strNameTarget  = settings.upload.fileNameFormat
        .replace('{{date}}', moment().format(settings.upload.dateFormat))
        .replace('{{fileName}}', strNameEncoded);
    return strNameTarget;
}

// *****************************************************************************

/**
 * Helper function to make the file name by replacing empty spaces by dashes.
 *
 * @private
 * @param  {String} strNameSource  string of the file name source
 * @return {String}                string of the file name target
 */
function _encodeName(strNameSource) {
    var strNameTarget = strNameSource
        .replace(/\s+/g, '-')
        .replace(/\-{2,}/g, '-');
    return strNameTarget;
}

// *****************************************************************************

})();