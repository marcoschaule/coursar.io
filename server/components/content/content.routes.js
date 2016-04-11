(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var multer       = require('multer');
var ContentCtrl  = require('./content.controller.js');
var CreateRouter = require('../../classes/router.class.js');
var libUpload    = require(paths.libs + '/upload.lib.js');

var uploadImages = multer(libUpload.settingsWithStorage('images'));
var objRoutes    = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the private routes.
 * @type {Object}
 */
objRoutes.private = {
    put: [
        ['/admin/content',
            ContentCtrl.handleContent],
        ['/admin/content/create',
            uploadImages.fields([
                { name: 'mediaFile',  maxCount: 1 },
                { name: 'imageFiles' }
            ]),
            ContentCtrl.createContent],
    ],
};

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
