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
var _           = require('underscore');
var mongooseLib = require(paths.libs + '/mongoose.lib.js');

// definitions
var CioTypes    = mongooseLib.schemaTypes;

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
// Resource functions
// *****************************************************************************

/**
 * Resource function to extend an external resource object
 * with the local base one.
 *
 * @public
 * @param  {Object} objToExtend  the object to extend the base one with
 * @return {Object}              the extended object
 */
function extendWith(objToExtend) {
    return _.extend(objResource, objToExtend);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.resource   = objResource;
module.exports.extendWith = extendWith;

// *****************************************************************************

})();