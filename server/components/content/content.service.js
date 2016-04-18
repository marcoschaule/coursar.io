(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var async                = require('async');
var contentBasicResource = require('./content-basic.resource.js');
var contentResource      = require('./content.resource.js');
var ContentBasic         = contentBasicResource.Model;
var Content              = contentResource.Model;

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createContentBasic            = createContentBasic;
module.exports.createContentPresentation     = null;
module.exports.createContentStream           = null;
module.exports.createContentMultipleChoice   = null;
module.exports.createContentCompleteText     = null;
module.exports.createContentCompleteSequence = null;
module.exports.createContentPractical        = null;
module.exports.readContents                  = readContents;
module.exports.updateContents                = updateContents;
module.exports.deleteContents                = deleteContents;

// *****************************************************************************
// Service functions - default CRUD functions
// *****************************************************************************

/**
 * Service function to create one content element.
 * 
 * @public
 * @param {Object}   objUserSimple  object of a simplified version of the current user
 * @param {Object}   objContent     object to create a content from
 * @param {Function} callback       function for callback
 */
function createContentBasic(objUserSimple, objContent, callback) {
    var dateCurrent = new Date();
    var contentBasic;

    objContent        = _extendContent(objUserSimple, objContent, true);
    contentBasic      = new ContentBasic(objContent);
    contentBasic.type = 'basic';

    return contentBasic.save(function(objErr) {
        if (objErr) {
            console.error(ERRORS.CONTENT.CREATE.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.CREATE.GENERAL);
        }
        return callback(null, contentBasic);
    });
}

// *****************************************************************************

/**
 * Service function to read multiple or all contents.
 * 
 * @public
 * @param {Object}        objUserSimple   object of a simplified version of the current user
 * @param {Array|String}  [mixContentIds]  (optinal) array or string of content ids
 * @param {Object}        [objModifiers]   (optinal) object of modifiers
 * @param {Function}      callback         function for callback
 */
function readContents(objUserSimple, mixContentIds, objModifiers, callback) {
    if (!callback && 'function' === typeof objModifiers) {
        callback = objModifiers;
    }
    if (!callback && 'function' === typeof mixContentIds) {
        callback = mixContentIds;
    }

    var objQuery      = {};
    var isSingular    = false;
    var arrContentIds = mixContentIds || [];

    if ('string' === typeof mixContentIds) {
        arrContentIds = [mixContentIds];
    }
    if (arrContentIds && arrContentIds.length > 0) {
        objQuery = { _id: { $in: arrContentIds } };
    }
    if (arrContentIds.length === 1) {
        isSingular = true;
    }

    objModifiers        = objModifiers        || {};
    objModifiers.select = objModifiers.select || '';
    objModifiers.limit  = objModifiers.limit  || '';
    objModifiers.sort   = objModifiers.sort   || '';

    return Content
        .find(objQuery)
        .select(objModifiers.select)
        .limit(objModifiers.limit)
        .sort(objModifiers.sort)
        .exec((objErr, arrContents) => {

            if (objErr) {
                console.error(ERRORS.CONTENT.READ.GENERAL);
                console.error(objErr);
                return callback(ERRORS.CONTENT.READ.GENERAL);
            }
            if (isSingular && arrContents && arrContents[0]) {
                return callback(null, arrContents[0]);
            }
            return callback(null, arrContents);
        });
}

// *****************************************************************************

/**
 * Service function to update multiple contents.
 * 
 * @public
 * @param {Object}        objUserSimple  object of a simplified version of the current user
 * @param {Array|String}  mixContents    array or string of the contents to be updated
 * @param {Function}      callback       function for callback
 */
function updateContents(objUserSimple, mixContents, callback) {
    var arrContents = mixContents;

    if (Object.prototype.toString.call(mixContents) !== '[object Array]') {
        arrContents = [mixContents];
    }

    return async.eachSeries(arrContents, (objContent, _callback) => {
        objContent = _extendContent(objContent);

        return ContentBasic.update({ $set: objContent }, _callback);
    
    }, (objErr, objModifications) => {
        if (objErr) {
            console.error(ERRORS.CONTENT.UPDATE.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.UPDATE.GENERAL);
        }
        return callback(null, arrContents);
    });
}

// *****************************************************************************

/**
 * Service function to delete multiple contents.
 * 
 * @public
 * @param {Object}        objUserSimple  object of a simplified version of the current user
 * @param {Array|String}  mixContentIds  array or string of content ids
 * @param {Function}      callback       function for callback
 */
function deleteContents(objUserSimple, mixContentIds, callback) {
    var objQuery      = {};
    var arrContentIds = mixContentIds || [];
    
    if ('string' === typeof mixContentIds) {
        arrContentIds = [mixContentIds];
    }
    if (arrContentIds && arrContentIds.length > 0) {
        objQuery = { _id: { $in: arrContentIds } };
    }

    return ContentBasic.remove(objQuery, (objErr, objModifications) => {
        if (objErr) {
            console.error(ERRORS.CONTENT.DELETE.GENERAL);
            console.error(objErr);
            return callback(ERRORS.CONTENT.DELETE.GENERAL);
        }
        return callback(null, objModifications);
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to extend a content object with the basic content information.
 * 
 * @private
 * @param {Object}   objUserSimple  object of a simplified version of the current user
 * @param {Object}   objContent     object to create a content from
 * @param {Function} callback       function for callback
 */
function _extendContent(objUserSimple, objContent, isCreation) {
    var dateCurrent = new Date();

    objContent.createdBy = isCreation && objUserSimple;
    objContent.createdAt = isCreation && dateCurrent;
    objContent.updatedBy = objUserSimple;
    objContent.updatedAt = dateCurrent;
    objContent.title     = isCreation && objContent.title;
    objContent.name      = isCreation && objContent.name;
    objContent.state     = isCreation && 'draft';
    return objContent;
}

// *****************************************************************************

})();