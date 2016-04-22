(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs                   = require('fs');
var async                = require('async');
var contentBasicResource = require('./content-basic.resource.js');
var contentResource      = require('./content.resource.js');
var ContentBasic         = contentBasicResource.Model;
var Content              = contentResource.Model;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createContentBasic            = createContentBasic;
module.exports.createContentPresentation     = null;
module.exports.createContentStream           = null;
module.exports.createContentMultipleChoice   = null;
module.exports.createContentCompleteText     = null;
module.exports.createContentCompleteSequence = null;
module.exports.createContentPractical        = null;
module.exports.readContents                  = readContents;
module.exports.updateContents                = updateContents;
module.exports.deleteContents                = deleteContents;
module.exports.deleteContentFiles            = deleteContentFiles;
module.exports.testName                      = testName;

// *****************************************************************************
// Service functions - default CRUD functions
// *****************************************************************************

/**
 * Service function to create one content element.
 * 
 * @public
 * @param {Object}   objUserSimple  object of a simplified version of the current user
 * @param {Object}   objContent     object to create a content from
 * @param {Function} callback       function for callback
 */
function createContentBasic(objUserSimple, objContent, callback) {
    var dateCurrent = new Date();
    var contentBasic;

    objContent        = _extendContent(objUserSimple, objContent, true);
    contentBasic      = new ContentBasic(objContent);
    contentBasic.type = 'basic';

    return contentBasic.save(function(objErr) {
        if (objErr) {
            console.error(ERRORS.CONTENT.CREATE.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.CREATE.GENERAL);
        }
        return callback(null, contentBasic);
    });
}

// *****************************************************************************

/**
 * Service function to read multiple or all contents.
 * 
 * @public
 * @param {Array|String} [mixContentIds]  (optinal) array or string of content ids
 * @param {Object}       [objModifiers]   (optinal) object of modifiers
 * @param {Function}     callback         function for callback
 */
function readContents(mixContentIds, objModifiers, callback) {
    if (!callback && 'function' === typeof objModifiers) {
        callback = objModifiers;
    }
    if (!callback && 'function' === typeof mixContentIds) {
        callback = mixContentIds;
    }

    var objQuery      = {};
    var isSingular    = false;
    var arrContentIds = mixContentIds || [];

    if ('string' === typeof mixContentIds) {
        arrContentIds = [mixContentIds];
    }
    if (arrContentIds && arrContentIds.length > 0) {
        objQuery = { _id: { $in: arrContentIds } };
    }
    if (arrContentIds.length === 1) {
        isSingular = true;
    }

    objModifiers        = objModifiers        || {};
    objModifiers.select = objModifiers.select || '';
    objModifiers.limit  = objModifiers.limit  || '';
    objModifiers.sort   = objModifiers.sort   || '';

    return Content
        .find(objQuery)
        .select(objModifiers.select)
        .limit(objModifiers.limit)
        .sort(objModifiers.sort)
        .exec((objErr, arrContents) => {

            if (objErr) {
                console.error(ERRORS.CONTENT.READ.GENERAL);
                console.error(objErr);
                return callback(ERRORS.CONTENT.READ.GENERAL);
            }
            if (isSingular && arrContents && arrContents[0]) {
                return callback(null, arrContents[0]);
            }
            return callback(null, arrContents);
        });
}

// *****************************************************************************

/**
 * Service function to update multiple contents.
 * 
 * @public
 * @param {Array|String} mixContents  array or string of the contents to be updated
 * @param {Function}     callback     function for callback
 */
function updateContents(mixContents, callback) {
    var arrContents = mixContents;

    if (Object.prototype.toString.call(mixContents) !== '[object Array]') {
        arrContents = [mixContents];
    }

    return async.eachSeries(arrContents, (objContent, _callback) => {
        objContent = _extendContent(objContent);

        return ContentBasic.update({ $set: objContent }, _callback);
    
    }, (objErr, objModifications) => {
        if (objErr) {
            console.error(ERRORS.CONTENT.UPDATE.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.UPDATE.GENERAL);
        }
        return callback(null, arrContents);
    });
}

// *****************************************************************************

/**
 * Service function to delete multiple contents.
 * 
 * @public
 * @param {Array|String} mixContentIds  array or string of content ids
 * @param {Function}     callback       function for callback
 */
function deleteContents(mixContentIds, callback) {
    var strSelect = 'mediaFile imageFiles';
    var arrContentIds, objQuery, arrFiles;
    
    arrContentIds = 'string' === typeof mixContentIds ?
        [mixContentIds] : mixContentIds;
    objQuery = { _id: { $in: arrContentIds } };

    return async.series([

            // get contents by id to get all connected files
            (_callback) => {
                return Content
                    .find(objQuery)
                    .select(strSelect)
                    .exec((objErr, arrContents) => {

                    if (objErr) {
                        console.error(ERRORS.CONTENT.DELETE.READ_CONTENTS);
                        console.error(objErr);
                        return _callback(ERRORS.CONTENT.DELETE.READ_CONTENTS);
                    }
                    return _callback(null, arrContents);
                });
            },

            // extract files from contents array
            (arrContents, _callback) => {
                arrFiles = _extractFilesFromArrayOfContents(arrContents);
                if (!arrFiles) {
                    console.error(ERRORS.CONTENT.DELETE.EXTRACT_FILES);
                    return _callback(ERRORS.CONTENT.DELETE.EXTRACT_FILES);
                }
                return _callback(null, arrFiles);
            },

            // delete all files
            (arrFiles, _callback) => {
                return deleteContentFiles(arrFiles, objErr => {
                    if (objErr) {
                        console.error(ERRORS.CONTENT.DELETE.DELETE_FILES);
                        console.error(objErr);
                        return _callback(ERRORS.CONTENT.DELETE.DELETE_FILES);
                    }
                    return _callback(null, arrContents);
                });
            },

            // delete contents
            (_callback) => {
                return ContentBasic.remove(objQuery, (objErr, objResult) => {
                    if (objErr) {
                        console.error(ERRORS.CONTENT.DELETE.DELETE_CONTENTS);
                        console.error(objErr);
                        return _callback(ERRORS.CONTENT.DELETE.DELETE_CONTENTS);
                    }
                    return _callback(null, arrContents);
                });
            },
        ],

        // series callback function
        // "objResult" can be "{ nRemoved: 4 }"
        (objErr, objResult) => callback(objErr, objResult));
}

// *****************************************************************************

/**
 * Service function to delete one file or an array of files, attached to an content.
 *
 * @public
 * @param {String|Array} mixFiles  string of filename or array of strings of filenames
 * @param {Function}     callback  function for callback
 */
function deleteContentFiles(mixFiles, callback) {
    var arrFiles = 'string' === typeof mixFiles ? [mixFiles] : mixFiles;
    var strFilePath;

    return async.eachSeries(arrFiles,

        // eachSeries action function
        (strFilename, _callback) => {
            strFilePath = path.join(paths.uploads, strFilename);
            return fs.unlink(strFilePath, _callback);
        }, 

        // eachSeries callback function
        objErr => {
            if (objErr) {
                console.error(ERRORS.CONTENT.DELETE_FILES.GENERAL);
                console.error(objErr);
                return callback(ERRORS.CONTENT.DELETE_FILES.GENERAL);
            }
            return callback(null);
        });
}

// *****************************************************************************

/**
 * Service function to test if the name is available.
 *
 * @public
 * @param {String}   strName   string of the content's name
 * @param {Function} callback  function for callback
 */
function testName(strName, callback) {
    return Content.findOne({ name: strName }, (objErr, objResult) => {
        if (objErr) {
            console.error(ERRORS.CONTENT.TEST_NAME.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.TEST_NAME.GENERAL, 'error');
        }
        if (!objResult) {
            return callback(null, 'available');
        }
        return callback(null, 'not-available');
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to extend a content object with the basic content information.
 * 
 * @private
 * @param {Object}   objUserSimple  object of a simplified version of the current user
 * @param {Object}   objContent     object to create a content from
 * @param {Function} callback       function for callback
 */
function _extendContent(objUserSimple, objContent, isCreation) {
    var dateCurrent = new Date();

    objContent.createdBy = isCreation && objUserSimple;
    objContent.createdAt = isCreation && dateCurrent;
    objContent.updatedBy = objUserSimple;
    objContent.updatedAt = dateCurrent;
    objContent.title     = isCreation && objContent.title;
    objContent.name      = isCreation && objContent.name;
    objContent.state     = isCreation && 'draft';
    return objContent;
}

// *****************************************************************************

/**
 * Helper function to extract all files from multiple contents at once.
 *
 * @public
 * @param  {Array} arrContents  array of content objects to extract files from
 * @return {Array}              array of files extracted from each content object
 */
function _extractFilesFromArrayOfContents(arrContents) {
    var arrFilesTotal = [], i;
    for (i = 0; i < arrContents.length; i += 1) {
        arrFilesTotal.concat(_extractFilesFromContent(arrContents[i]));
    }
    return arrFilesTotal;
}

// *****************************************************************************

/**
 * Helper function to extract all files from content.
 *
 * @public
 * @param  {Object} objContent  object of the content to extract all files from
 * @return {Array}              array of the files that have been extracted
 */
function _extractFilesFromContent(objContent) {
    var arrFiles = [];
    if (objContent.imageFiles && objContent.imageFiles.length > 0) {
        arrFiles = objContent.imageFiles.map(objFile => {
            return objFile.filename;
        });
    }
    if (objContent.mediaFile && objContent.mediaFile.filename) {
        arrFiles.push(objContent.mediaFile.filename);
    }
    return arrFiles;
}

// *****************************************************************************

})();