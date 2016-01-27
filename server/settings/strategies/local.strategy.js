(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('../../components/users/user.schema.js').User;

// *****************************************************************************
// Strategy
// *****************************************************************************

function strategyLocal(username, password, callback) {

    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return callback(err);
        }
        if (!user) {
            return callback(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
            return callback(null, false, { message: 'Incorrect password.' });
        }
        return callback(null, user);
    });
}

passport.use(new LocalStrategy(strategyLocal));

// ********************************************************************************

})();