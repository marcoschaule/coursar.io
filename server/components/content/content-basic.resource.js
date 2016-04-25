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
var _                  = require('underscore');
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
var _objTypeStringSelect   = _.extend(CioTypes.String, { select: true });
var _objTypeStringNoSelect = _.extend(CioTypes.String, { select: false });

// *****************************************************************************
// Resource definition
// *****************************************************************************

var objMediaFile = {
    fieldname   : _objTypeStringSelect,
    originalname: _objTypeStringSelect,
    encoding    : _objTypeStringNoSelect,
    mimetype    : _objTypeStringSelect,
    destination : _objTypeStringNoSelect,
    filename    : _objTypeStringSelect,
    path        : _objTypeStringNoSelect,
    size        : { type: Number, select: false },
}; 

var objResource = objResourceCommon.extendWith({
    text           : CioTypes.String,
    mediaFile      : objMediaFile,
    mediaFilePoster: objMediaFile,
    imageFiles     : [ objMediaFile ],
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