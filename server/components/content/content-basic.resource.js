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
var _                      = require('underscore');
var mongoose               = require('mongoose');
var whitelist              = require('walter-whitelist');
var mongooseLib            = require(paths.libs + '/mongoose.lib.js');
var ResourceCommon         = require('./content.resource.js');

// definitions
var Schema                 = mongoose.Schema;
var CioTypes               = mongooseLib.schemaTypes;
var Url                    = mongoose.SchemaTypes.Url;

// private variables
var _strModelName          = 'ContentLearningBasic';
var _strCollectionName     = 'contents';
var _objTypeStringSelect   = _.extend(CioTypes.String, { select: true });
var _objTypeStringNoSelect = _.extend(CioTypes.String, { select: false });

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

var objResource = ResourceCommon.extendWith({
    text           : CioTypes.String,
    mediaFile      : objMediaFile,
    mediaFilePoster: objMediaFile,
    imageFiles     : [ objMediaFile ],
});

// *****************************************************************************
// Whitelist filters
// *****************************************************************************

var objWhitelistMediaFile = {
    fieldname   : false,
    originalname: true,
    encoding    : false,
    mimetype    : true,
    destination : false,
    filename    : true,
    path        : false,
    size        : false,
};

var objWhitelistResource = {
    text           : true,
    mediaFile      : objWhitelistMediaFile,
    mediaFilePoster: objWhitelistMediaFile,
    imageFiles     : true,
};

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

module.exports.filterWhitelistList = ResourceCommon.setupWhitelistFilter();
module.exports.filterWhitelist     = ResourceCommon.setupWhitelistFilter(objWhitelistResource);
module.exports.resource            = objResource;
module.exports.schema              = schema;
module.exports.Model               = Model;
module.exports[_strModelName]      = Model;

// *****************************************************************************

})();