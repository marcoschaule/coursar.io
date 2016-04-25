(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs             = require('fs');
var path           = require('path');
var multer         = require('multer');
var ContentService = require('./content.service.js');
var libUpload      = require(paths.libs + '/upload.lib.js');
var uploads        = multer(libUpload.settingsWithStorage());

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readContents        = readContents;
module.exports.createContent       = createOrUpdateContent;
module.exports.updateContent       = createOrUpdateContent;
module.exports.deleteContents      = deleteContents;
module.exports.uploadContent       = uploadContent;
module.exports.readMediaFile       = readMediaFile;
module.exports.readMediaFilePoster = readMediaFilePoster;
module.exports.testName            = testName;

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

    return ContentService.readContents(arrContentIds, objMidifiers,
            (objErr, arrContents) => {

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
    if (req.files.mediaFilePoster && req.files.mediaFilePoster.length > 0) {
        objContent.mediaFilePoster = req.files.mediaFilePoster[0];
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
 * Controller function to delete contents.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function deleteContents(req, res, next) {
    var arrContentIds = req.body.arrContentIds;
    return Content.deleteContents(arrContentIds, objErr => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ err: null, success: true });
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
    return uploads.fields([
        { name: 'mediaFile',       maxCount: 1 },
        { name: 'mediaFilePoster', maxCount: 1 },
        { name: 'imageFiles' }
    ])(req, res, next);
}

// *****************************************************************************

/**
 * Controller function to get the media file.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function readMediaFile(req, res, next) {
    var arrPositions, numStart, numTotal, numEnd, numChunksize, stream;
    var strPath  = encodeURI(path.join(paths.uploads, req.params.filename)); // TODO: care about encoding
    var strRange = req.headers && req.headers.range;
    
    if (!strRange) {
        return res.sendStatus(416); // 416 Wrong range
    }

    return fs.stat(strPath, (objErr, stats) => {
        if (objErr) {
            console.error(objErr);
            return next(objErr);
        }

        arrPositions = strRange.replace(/bytes=/, '').split('-');
        numStart     = parseInt(arrPositions[0], 10);
        numTotal     = stats.size;
        numEnd       = arrPositions[1] ? parseInt(arrPositions[1], 10) : numTotal - 1;
        numChunksize = (numEnd - numStart) + 1;

        res.writeHead(206, {
            'Content-Range' : 'bytes ' + numStart + '-' + numEnd + '/' + numTotal,
            'Accept-Ranges' : 'bytes',
            'Content-Type'  : 'video/mp4',
            'Content-Length': numChunksize,
        });

        stream = fs.createReadStream(strPath, { start: numStart, end: numEnd });
        stream.on('open', () => {
            return stream.pipe(res);
        });
        stream.on('error', (objErr) => {
            console.error(objErr);
            return res.end(objErr);
        });
    });
}

// *****************************************************************************

/**
 * Controller function to get the media file poster.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function readMediaFilePoster(req, res, next) {
    var strFilePath = path.join(paths.uploads, req.params.filename);
    return res.status(200).sendFile(strFilePath);
}

// *****************************************************************************

function removeImageFile(req, res, next) {}

// *****************************************************************************

/**
 * Controller function to test the name for availability.
 *
 * @public
 * @param {Object}   req   object of Express request
 * @param {Object}   res   object of Express response
 * @param {Function} next  function of callback for next middleware
 */
function testName(req, res, next) {
    var strName = req.body.name;
    return ContentService.testName(strName, (objErr, strResult) => {
        return res.json({ err: objErr, state: strResult });
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************

})();