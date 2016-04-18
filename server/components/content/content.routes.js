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
        ['/admin/content/file/:filename',
            // handle creation of the content
            ContentCtrl.getFile],
    ],
    put: [

        // create one content
        ['/admin/content/create',
            // upload files with each request, but only if available
            ContentCtrl.uploadContent,
            // handle creation of the content
            ContentCtrl.createContent],

        // create one content
        ['/admin/content/read',
            // handle creation of the content
            ContentCtrl.readContents],
        
        // update one content
        ['/admin/content/update',
            // upload files with each request, but only if available
            ContentCtrl.uploadContent,
            // handle updating of the content
            ContentCtrl.updateContent],

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
