(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var multer         = require('multer');
var ContentService = require('./content.service.js');
var libUpload      = require(paths.libs + '/upload.lib.js');

var uploadMedia    = multer(libUpload.settingsWithStorage('media'));
var uploadImages   = multer(libUpload.settingsWithStorage('images'));

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createContent = createContent;
module.exports.handleContent = handleContent;

// *****************************************************************************
// Controller functions
// *****************************************************************************

function createContent(req, res, next) {
    var objFileMedia   = req.file;
    var arrFilesImages = req.files;
    var objData        = req.body;

    var objCreate = {
        mediaFile     : req.file,
        arrFilesImages: req.files,
        data          : objData,
    };

    console.log(">>> Debug ====================; req.body:", req.body);
    console.log(">>> Debug ====================; req.file:", req.file);
    console.log(">>> Debug ====================; req.files:", req.files, '\n\n');
    return res.status(200).json({});
}

// *****************************************************************************

function handleContent(req, res, next) {
    var strTarget    = req.body.target;
    var objData      = req.body.data      || null;
    var objModifiers = req.body.modifiers || {};
    var arrArgs      = [objData, __callback];
    var isSingular   = 's' !== strTarget.charAt(strTarget.length-1);

    if (!strTarget || !ContentService[strTarget]) {
        return next(new Error('Target not defined in service!'));
    }
    if ('readUsers' === strTarget) {
        arrArgs.splice(1, 0, objModifiers);
    }
    return UserAdminController[strTarget].apply(UserAdminController, arrArgs);

    function __callback(objErr, mixUsers) {
        if (objErr) {
            return next(objErr);
        }
        if (isSingular) {
            return res.status(200).json({ err: null, objUser: mixUsers });
        }
        return res.status(200).json({ err: null, arrUsers: mixUsers });
    }
}

// *****************************************************************************

})();