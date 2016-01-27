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
    username: { type: String, required: true },
    password: { type: String, required: true },
    emails  : [{
        address  : { type: Email },
        validated: { type: Boolean, default: false },
    }],
    profile : {
        firstName  : { type: String },
        lastName   : { type: String },
        dateOfBirth: { type: Date },
    },
});

// *****************************************************************************
// Model
// *****************************************************************************

var User = mongoose.model('User', blogSchema, 'users');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.User = User;

// ********************************************************************************

})();