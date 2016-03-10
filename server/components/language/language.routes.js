(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var LanguageCtrl = require('./language.controller.js');

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
    app.put('/translate/:strLanguageKey',
            LanguageCtrl.getLanguage);
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