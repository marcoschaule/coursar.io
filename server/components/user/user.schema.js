(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var Email    = mongoose.SchemaTypes.Email;

// *****************************************************************************
// Schema
// *****************************************************************************

var schemaUser = new Schema({
    username          : { type: String, required: true },
    password          : { type: String, required: true },
    emails            : [{
        address       : { type: Email },
        validated     : { type: Boolean, default: false },
    }],
    emailMain         : { type: Email, required: true },
    profile           : {
        firstName     : { type: String },
        lastName      : { type: String },
        dateOfBirth   : { type: Date },
    },
    payments          : {
        creditCard    : {
            cardNumber: { type: String }
        }
    },
});

// *****************************************************************************
// Model, adding passport
// *****************************************************************************

// create model
var User = mongoose.model('User', schemaUser, 'users');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.schemaUser = schemaUser;
module.exports.User       = User;

// ********************************************************************************

})();