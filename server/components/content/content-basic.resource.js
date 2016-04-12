/**
 * @name        ContentLearningBasic
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an Mongoose resource file.
 * @description This Mongoose resource describes the data of a basic content type
 *              (like text, video, audio, images etc.).
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
var mongooseLib        = require(paths.libs + '/mongoose.lib.js');
var objResourceCommon  = require('./content.resource.js');

// definitions
var Schema             = mongoose.Schema;
var CioTypes           = mongooseLib.schemaTypes;
var Url                = mongoose.SchemaTypes.Url;

// private variables
var _strModelName      = 'ContentLearningBasic';
var _strCollectionName = 'contents';

// *****************************************************************************
// Resource definition
// *****************************************************************************

var objMediaFile = {
    fieldname   : CioTypes.String,
    originalname: CioTypes.String,
    encoding    : CioTypes.String,
    mimetype    : CioTypes.String,
    destination : CioTypes.String,
    filename    : CioTypes.String,
    path        : CioTypes.String,
    size        : Number,
}; 

var objResource = objResourceCommon.extendWith({
    text      : CioTypes.String,
    mediaFile : objMediaFile,
    imageFiles: [ objMediaFile ],
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