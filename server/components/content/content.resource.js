/**
 * @name        ContentCommonResource
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an Mongoose resource file.
 * @description This Mongoose resource consists of all parts all resources
 *              have in common.
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
var whitelist          = require('walter-whitelist');
var mongooseLib        = require(paths.libs + '/mongoose.lib.js');

// definitions
var Schema             = mongoose.Schema;
var CioTypes           = mongooseLib.schemaTypes;

// private variables
var _strModelName      = 'Content';
var _strCollectionName = 'contents';

// *****************************************************************************
// Resource definition
// *****************************************************************************

var objResource = {
    createdBy: CioTypes.UserRef,
    createdAt: CioTypes.DateDef,
    updatedBy: CioTypes.UserRef,
    updatedAt: CioTypes.DateDef,
    title    : CioTypes.String,
    name     : CioTypes.StringDashCase,
    state    : CioTypes.StatePublish,
    type     : CioTypes.TypeContent,
};

// *****************************************************************************
// Whitelist filters
// *****************************************************************************

var objWhitelistResource = {
    _id      : true,
    createdBy: true,
    createdAt: true,
    updatedBy: true,
    updatedAt: true,
    title    : true,
    name     : true,
    state    : true,
    type     : true,
};

// *****************************************************************************
// Resource functions
// *****************************************************************************

/**
 * Resource function to extend an external resource object
 * with the local base one.
 *
 * @public
 * @param  {Object} objToExtend  object to extend the base one with
 * @return {Object}              object that is extended
 */
function extendWith(objToExtend) {
    return _.extend({}, objResource, objToExtend);
}

// *****************************************************************************

/**
 * Resource function to extend an external whitelist object
 * with the local whitelist.
 *
 * @public
 * @param  {Object} objToExtend  object to extend the local whitelist with
 * @return {Object}              object that is extended
 */
function whitelistsWith(objToExtend) {
    return _.extend({}, objWhitelistResource, objToExtend);
}

// *****************************************************************************

/**
 * Resource function return a function, that tests and filters a given object
 * with the defined whitelist - locally or extended.
 *
 * @public
 * @param  {Object} objWhitelistExtension  object to extend the local whitelist with
 * @return {Function}                      function to whitelist a given source object
 */
function setupWhitelistFilter(objWhitelistExtension) {
    objWhitelistExtension = objWhitelistExtension || {};
    var objWhitelist = whitelistsWith(objWhitelistExtension);
    var objOptions   = {
        omitDisallowed: true,
        omitUndefined : true,
    };

    return (mixObject) => {
        if (_.isArray(mixObject)) {
            return mixObject.map(obj => 
                whitelist(obj.toObject(), objWhitelist, objOptions));
        }
        return whitelist(mixObject.toObject(), objWhitelist, objOptions);
    };
}

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

module.exports.resource             = objResource;
module.exports.schema               = schema;
module.exports.Model                = Model;
module.exports[_strModelName]       = Model;
module.exports.extendWith           = extendWith;
module.exports.whitelistsWith       = whitelistsWith;
module.exports.setupWhitelistFilter = setupWhitelistFilter;

// *****************************************************************************

})();