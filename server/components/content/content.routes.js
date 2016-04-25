(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var ContentCtrl  = require('./content.controller.js');
var CreateRouter = require('../../classes/router.class.js');
var objRoutes    = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the private routes.
 * @type {Object}
 */
objRoutes.private = {
    get: [

        // read a media file
        ['/admin/content/read-media-file/:filename',
            ContentCtrl.readMediaFile],

        // read a media file poster
        ['/admin/content/read-media-file-poster/:filename',
            ContentCtrl.readMediaFilePoster],
    ],
    put: [

        // create one content
        ['/admin/content/create',
            ContentCtrl.uploadContent,
            ContentCtrl.createContent],

        // read contents
        ['/admin/content/read',
            ContentCtrl.readContents],
        
        // update one content
        ['/admin/content/update',
            ContentCtrl.uploadContent,
            ContentCtrl.updateContent],
        
        // delete one content
        ['/admin/content/delete',
            ContentCtrl.deleteContents],
        
        // delete one media file
        ['/admin/content/delete-media-file',
            ContentCtrl.updateContent],
        
        // delete one image file
        ['/admin/content/delete-image-files',
            ContentCtrl.deleteContentImageFiles],
        
        // test if a content name is available
        ['/admin/content/test-name',
            ContentCtrl.testName],

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
