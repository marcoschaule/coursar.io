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
function init(app, arrMiddlewares) {
    if (!arrMiddlewares) {
        arrMiddlewares = [];
    }

    app.post.apply(app, ['/sign-in']
        .concat(arrMiddlewares, AuthCtrl.signIn));
    app.post.apply(app, ['/sign-up']
        .concat(arrMiddlewares, AuthCtrl.signUp));
    app.post.apply(app, ['/sign-out']
        .concat(arrMiddlewares, AuthCtrl.signOut));
    app.post.apply(app, ['/is-signed-in']
        .concat(arrMiddlewares, AuthCtrl.isSignedIn));
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