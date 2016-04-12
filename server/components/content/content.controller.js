(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var multer         = require('multer');
var ContentService = require('./content.service.js');
var libUpload      = require(paths.libs + '/upload.lib.js');

var uploadImages   = multer(libUpload.settingsWithStorage('images'));
var objRoutes      = {};


// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.handleContent = handleContent;
module.exports.uploadContent = uploadContent;

// *****************************************************************************
// Controller functions
// *****************************************************************************

function readContent(req, res, next) {

}

// *****************************************************************************

/**
 * Controller function to handle the content request except for creation.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function handleContent(req, res, next) {
    var strTarget     = req.body.target;
    var objContent    = req.body.content     || null;
    var objModifiers  = req.body.modifiers   || null;

    var isSingular    = (strTarget && 's' !== strTarget.charAt(strTarget.length-1));
    var isReadRequest = (strTarget.indexOf('read') >= 0 && objModifiers);

    if (req.files.mediaFile && req.files.mediaFile.length > 0) {
        objContent.mediaFile = req.files.mediaFile[0];
    }
    if (req.files.imageFiles && req.files.imageFiles.length > 0) {
        objContent.imageFiles = req.files.imageFiles;
    }

    var arrArgs = [objContent, __callback];
    isReadRequest && arrArgs.splice(1, 0, objModifiers);

    return ContentService[strTarget].apply(ContentService, arrArgs);

    function __callback(objErr, mixContent) {
        if (objErr) {
            return next(objErr);
        }
        if (isSingular) {
            return res.status(200).json({ err: null, objContent: mixContent });
        }
        return res.status(200).json({ err: null, arrContents: mixContent });
    }
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

})();