(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var multer         = require('multer');
var ContentService = require('./content.service.js');
var libUpload      = require(paths.libs + '/upload.lib.js');
var uploadImages   = multer(libUpload.settingsWithStorage('images'));

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readContents  = readContents;
module.exports.createContent = createOrUpdateContent;
module.exports.updateContent = createOrUpdateContent;
module.exports.uploadContent = uploadContent;
module.exports.getFile       = getFile;

// *****************************************************************************
// Controller functions
// *****************************************************************************

/**
 * Controller function to read contents.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function readContents(req, res, next) {
    var arrContentIds = req.body.contentIds || null;
    var objMidifiers  = req.body.modifiers  || null;

    return ContentService.readContents(req.session.user, arrContentIds,
            objMidifiers, (objErr, arrContents) => {

        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ err: null, contents: arrContents });
    });
}

// *****************************************************************************

/**
 * Controller function to either create or update one content.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function createOrUpdateContent(req, res, next) {
    var strTarget  = req.body.target || 'createContentBasic';
    var objContent = req.body.content;

    if (req.files.mediaFile && req.files.mediaFile.length > 0) {
        objContent.mediaFile = req.files.mediaFile[0];
    }
    if (req.files.imageFiles && req.files.imageFiles.length > 0) {
        objContent.imageFiles = req.files.imageFiles;
    }

    return ContentService[strTarget].call(ContentService, req.session.user,
            objContent, (objErr, objContentFinal) => {

        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ err: null, content: objContentFinal });
    });
}

// *****************************************************************************

/**
 * Controller function to upload content files send from client.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function uploadContent(req, res, next) {
    return uploadImages.fields([
        { name: 'mediaFile',  maxCount: 1 },
        { name: 'imageFiles' }
    ])(req, res, next);
}

// *****************************************************************************

/**
 * Controller function to get the file.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function getFile(req, res, next) {
    console.log(">>> Debug ====================; req.params:", req.params, '\n\n');
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************

})();