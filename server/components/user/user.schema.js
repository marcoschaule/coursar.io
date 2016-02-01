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

    // user's private information
    private            : {
        password       : {
            salt       : { type: String, required: true },
            hash       : { type: String, required: true },
        },
    },

    // user profile of information that can be delivered to client
    profile            : {

        // username as alternative for the email
        username       : { type: String, required: true },

        // natural name of the user
        name           : {
            title      : { type: String },
            first      : { type: String },
            last       : { type: String },
        },

        // date of birth
        dateOfBirth    : { type: Date },

        // all user's emails; convention: first email is main email
        emails         : [{
            address    : { type: Email },
            isValidated: { type: Boolean, default: false },
        }],
    },

    // user payments information
    payments           : {
        creditCard     : {
            cardNumber : { type: String }
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