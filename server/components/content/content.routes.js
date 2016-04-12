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
    put: [
        ['/admin/content',
            // upload files with each request, but only if available
            ContentCtrl.uploadContent,
            // handle creation, update and deletion of the content
            ContentCtrl.handleContent],
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
