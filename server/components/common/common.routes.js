(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path         = require('path');
var CreateRouter = require('../../classes/router.class.js');
var env          = process.env.NODE_ENV || 'dev';
var strFClient   = path.join(__dirname, '../../../.build/', env);
var strFAdmin    = path.join(__dirname, '../../../.build/', env + '-admin');
var objRoutes    = {};

// *****************************************************************************
// Route definitions
// *****************************************************************************

/**
 * Object of the public routes.
 * @type {Object}
 */
objRoutes.public = {
    get: [
        
        // route for all admin GET requests, that are public
        ['/admin/*',
            (req, res, next) => { res.sendFile(path.join(strFAdmin, 'layout.html')); }],
        
        // route for all client GET requests, that are public
        ['/*',
            (req, res, next) => { res.sendFile(path.join(strFClient, 'layout.html')); }],
    ],
};

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter(objRoutes);

// *****************************************************************************

})();
