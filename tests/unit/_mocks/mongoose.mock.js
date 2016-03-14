(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var sinon = require('sinon');

var _objGet     = { get: sinon.spy() };
var _objSrc     = {};
var _objOptions = {};
var _statics    = {};
var _methods    = {};

// *****************************************************************************
// Mock functions
// *****************************************************************************

/**
 * Mock function of the class object for "Schema".
 *
 * @private
 */
var mockSchema = function(objSrc, objOptions) {
    this.statics    = _statics;
    this.methods    = _methods;
    this.virtual    = () => _objGet;
    
    _objSrc     = objSrc;
    _objOptions = objOptions;

    sinon.spy(this, 'virtual');
};

// *****************************************************************************

/**
 * Mock function of the model function that returns something.
 *
 * @private
 * @return {String}  string "model"
 */
var mockModel = function() {
    return 'model';
};

// *****************************************************************************

/**
 * Mock function to return the authentication controller mock.
 *
 * @public
 * @return {Object}  object including all variables and functions of the controller
 */
function getMock() {
    var mongoose = {};

    mongoose.Schema = mockSchema;
    mongoose.model  = mockModel;

    // spy on object functions
    sinon.spy(mongoose, 'Schema');
    sinon.spy(mongoose, 'model');

    return mongoose;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.objGet     = () => _objGet;
module.exports.objSrc     = () => _objSrc;
module.exports.objOptions = () => _objOptions;
module.exports.statics    = () => _statics;
module.exports.methods    = () => _methods;
module.exports.mockSchema = mockSchema;
module.exports.mockModel  = mockModel;
module.exports.mongoose   = getMock();

// *****************************************************************************

})();