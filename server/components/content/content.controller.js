(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs             = require('fs');
var path           = require('path');
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
    var strPath = path.join(paths.uploads, req.params.filename);
    var arrPositions, numStart, numTotal, numEnd, numChunksize, strRange, stream;

    return fs.stat(strPath, (objErr, stats) => {
        strRange = req.headers && req.headers.range;

        if (objErr) {
            return next(objErr);
        }
        if (!strRange) {
            return res.sendStatus(416); // 416 Wrong range
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
        stream.on('error', (err) => {
            return res.end(err);
        });
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************

})();