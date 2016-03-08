(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var AuthCtrl = require('./auth.controller.js');

// *****************************************************************************
// Routes linking
// *****************************************************************************

/**
 * Function to initialize auth routes.
 * 
 * @param {Object} app  object of the express application
 */
function init(app) {

    // POST routes
    app.put('/',            
            AuthCtrl.idle);
    app.put('/sign-in',     
            AuthCtrl.signIn);
    app.put('/sign-up',     
            AuthCtrl.signUp);
    app.put('/sign-out',    
            AuthCtrl.signOut);
    app.put('/forgot-password',    
            AuthCtrl.forgotPassword);
    app.put('/reset-password',    
            AuthCtrl.resetPassword);
    app.put('/is-available',
            AuthCtrl.isAvailable);
    app.put('/is-signed-in',
            AuthCtrl.middlewareAll,
            AuthCtrl.isSignedIn);
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.public = init;

// *****************************************************************************

})();