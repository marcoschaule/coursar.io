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
        ['/admin/content', ContentCtrl.handleContent],
    ],
};

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
