(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthCtrl = require('./auth/auth.controller.js');

// *****************************************************************************
// Routes linking
// *****************************************************************************

/**
 * Function to initialize routes.
 * 
 * @param {Object} app  object of the express application
 */
function init(app) {

    // publid routes
    // app.get('/', getHome);

    // auth routes
    app.post('/sign-in', AuthCtrl.signIn);
    app.post('/sign-up', AuthCtrl.signUp);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init = init;

// *****************************************************************************

})();