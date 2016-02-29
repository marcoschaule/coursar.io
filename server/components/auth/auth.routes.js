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
    app.post('/',            
            AuthCtrl.idle);
    app.post('/sign-in',     
            AuthCtrl.signIn);
    app.post('/sign-up',     
            AuthCtrl.signUp);
    app.post('/sign-out',    
            AuthCtrl.signOut);
    app.post('/is-signed-in',
            AuthCtrl.isSignedIn);
    app.post('/is-available',
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