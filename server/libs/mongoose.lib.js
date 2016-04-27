(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var mongoose       = require('mongoose');
var Schema         = mongoose.Schema;
var ObjectId       = mongoose.Schema.ObjectId;
var Url            = mongoose.SchemaTypes.Url;
var objSchemaTypes = {};

// *****************************************************************************
// (Additional) Mongoose schema types
// *****************************************************************************

// Flags
objSchemaTypes.FlagTrue              = { type: Boolean, default: true };
objSchemaTypes.FlagFalse             = { type: Boolean, default: false };

// Numbers
objSchemaTypes.Number                = { type: Number };
objSchemaTypes.NumberPos             = { type: Number, min: 1 };
objSchemaTypes.NumberPos0            = { type: Number, min: 0 };
objSchemaTypes.NumberNeg             = { type: Number, max: -1 };
objSchemaTypes.NumberNeg0            = { type: Number, max: 0 };

// Dates
objSchemaTypes.DateDef               = { type: Date, default: Date.now() };

// Strings
objSchemaTypes.String                = { trim: true, type: String };
objSchemaTypes.StringDashCase        = { trim: true, type: String, validate: /[a-zA-Z0-9\-]+/ };
objSchemaTypes.StringDashCaseUnique  = { trim: true, type: String, validate: /[a-zA-Z0-9\-]+/, unique: true };
objSchemaTypes.StringCamelCase       = { trim: true, type: String, validate: /[a-zA-Z]+/ };
objSchemaTypes.StringCamelCaseUnique = { trim: true, type: String, validate: /[a-zA-Z]+/, unique: true };

// states and types
objSchemaTypes.StatePublish          = { type: String, default: 'draft', validate: /draft|published/ };
objSchemaTypes.TypeContent           = { type: String, default: 'basic', validate: /basic|presentation|stream|multipleChoice|completeText|completeSequence|practical/ };
objSchemaTypes.TypeExerciseMC        = { type: String, default: 'one',   validate: /one|mixed/ };

// References
objSchemaTypes.UserRef               = { _id: ObjectId, username: objSchemaTypes.String, email: objSchemaTypes.String };

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.schemaTypes = objSchemaTypes;

// *****************************************************************************

})();