(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var contentBasicResource = require('./content-basic.resource.js');
var ContentBasic         = contentBasicResource.Model;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createContentBasic = createContentBasic;
module.exports.readContent        = readContent;
module.exports.updateContent      = updateContent;
module.exports.deleteContent      = deleteContent;
module.exports.createContents     = createContents;
module.exports.readContents       = readContents;
module.exports.updateContents     = updateContents;
module.exports.deleteContents     = deleteContents;

// *****************************************************************************
// Service functions - default CRUD functions
// *****************************************************************************

/**
 * Service function to create one content element.
 * 
 * @public
 * @param {Object}   objContent  object to create a content from
 * @param {Function} callback    function for callback
 */
function createContentBasic(objContent, callback) {
    var contentBasic;

    objContent        = _extendContent(objContent);
    contentBasic      = new ContentBasic(objContent);
    contentBasic.type = 'basic';

    return contentBasic.save(function(objErr) {
        if (objErr) {
            console.error(ERRORS.CONTENT.CREATE.SAVE);
            console.error(objErr);
            return callback(ERRORS.CONTENT.CREATE.SAVE);
        }
        return callback(null, contentBasic);
    });
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function readContent(strContentId, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function updateContent(objUpdate, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function deleteContent(strContentId, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function createContents(arrCreates, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function readContents(arrContentIds, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function updateContents(arrUpdates, callback) {
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @public
 * @param {[type]}   objRequest  to
 * @param {Function} callback   function for callback
 */
function deleteContents(arrContentIds, callback) {
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to extend a content object with the basic content information.
 * 
 * @private
 * @param {Object}   objContent  object to create a content from
 * @param {Function} callback    function for callback
 */
function _extendContent(objContent, callback) {
    var dateCurrent = new Date();
    var userCurrent = objContent.userCurrent || null;

    objContent.createdBy = userCurrent;
    objContent.createdAt = dateCurrent;
    objContent.updatedBy = userCurrent;
    objContent.updatedAt = dateCurrent;
    objContent.title     = objContent.title;
    objContent.name      = objContent.name;
    objContent.state     = 'draft';
    return objContent;
}

// *****************************************************************************

})();