/**
 * @name        ContentExercisingPractical
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an Mongoose resource file.
 * @description This Mongoose resource describes the data of a practical
 *              exercise content. The content consists of a problem, designed
 *              by the creator, and a solution, delivered by the user.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README
 */
(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// includes
var mongoose           = require('mongoose');
var mongooseLib        = require('../../libs/mongoose.lib.js');
var objResourceCommon  = require('./content.resource.js');

// definitions
var Schema             = mongoose.Schema;
var CioTypes           = mongooseLib.schemaTypes;

// private variables
var _strModelName      = 'ContentExercisingPractical';
var _strCollectionName = 'contents';

// *****************************************************************************
// Resource definition
// *****************************************************************************

var objResource = objResourceCommon.extendWith({
    exercise : {
        problem: {
            text  : CioTypes.String,
            points: CioTypes.NumberPos0,
        },
        solution: {
            text    : CioTypes.String,
            language: CioTypes.String,
        },
    },
});

// *****************************************************************************
// Schema definition
// *****************************************************************************

var schema = new Schema(objResource, { collection: _strCollectionName });

// *****************************************************************************
// Model definition
// *****************************************************************************

var Model = mongoose.model(_strModelName, schema, _strCollectionName);

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.resource       = objResource;
module.exports.schema         = schema;
module.exports.Model          = Model;
module.exports[_strModelName] = Model;

// *****************************************************************************

})();