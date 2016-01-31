(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../../user/user.schema.js').User;

// *****************************************************************************
// Strategy
// *****************************************************************************

/**
 * Strategy function for local authentication.
 * 
 * @param {String}   strUsername  string of username
 * @param {String}   strPassword  string of password
 * @param {Function} callback     function for callback
 */
function strategyLocal(strUsername, strPassword, callback) {

    return User.findOne({ username: strUsername }, function(objErr, objUser) {
        if (objErr) {
            return callback(objErr);
        }
        if (!objUser) {
            return callback(null, false, { message: 'Incorrect username.' });
        }
        if (!objUser.validPassword(strPassword)) {
            return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, objUser);
    });
}

// *****************************************************************************
// Using strategies
// *****************************************************************************

passport.use(new LocalStrategy(strategyLocal));

// ********************************************************************************

})();