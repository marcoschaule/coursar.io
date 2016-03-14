(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// *****************************************************************************
// Stub functions
// *****************************************************************************

/**
 * Stub function to return the authentication controller mock.
 *
 * @public
 * @return {Object}  object including all variables and functions of the controller
 */
function getMock() {
    var AuthCtrl = {};

    AuthCtrl.signIn         = function() {};
    AuthCtrl.signUp         = function() {};
    AuthCtrl.signOut        = function() {};
    AuthCtrl.forgotUsername = function() {};
    AuthCtrl.forgotPassword = function() {};
    AuthCtrl.resetPassword  = function() {};
    AuthCtrl.isAvailable    = function() {};
    AuthCtrl.isSignedIn     = function() {};
    AuthCtrl.authorize      = function() {};

    return AuthCtrl;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = getMock();

// *****************************************************************************

})();