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

    // [AuthCtrl.generateSession, AuthCtrl.touchSignedIn]

    // Middlewares
    app.use((req, res, next) => {
        if ('GET' === req.method) {
            return next();
        }

        return AuthCtrl.middlewareAll(req, res, next);
    });

    // POST routes
    app.put('/',            
            AuthCtrl.idle);
    app.put('/sign-in',     
            AuthCtrl.signIn);
    app.put('/sign-up',     
            AuthCtrl.signUp);
    app.put('/sign-out',    
            AuthCtrl.signOut);
    app.put('/is-signed-in',
            AuthCtrl.isSignedIn);
    app.put('/is-available',
            AuthCtrl.isAvailable);
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