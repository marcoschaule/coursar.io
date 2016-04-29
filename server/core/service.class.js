(function() { 'use strict';
/*jshint validthis:true */

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var _     = require('underscore');
var async = require('async');

// *****************************************************************************
// Private variables
// *****************************************************************************

var _arrPossibleHooks = [
    'hookCreateBefore',
    'hookCreateAfter',
    'hookReadBefore',
    'hookReadAfter',
    'hookUpdateBefore',
    'hookUpdateAfter',
    'hookDeleteBefore',
    'hookDeleteAfter',
];

var _defaultFunction = function() { return []; };

// *****************************************************************************
// Factory
// *****************************************************************************

/**
 * CioService factory function to create an object instance.
 *
 * @public
 * @param  {Object} objModel   object of the Mongoose model to create a
 *                             document from
 * @param  {Object} objFilter  object of the filters to filter the results
 * @param  {Object} objHooks   object of the hook functions
 * @return {Object}            object instance of the service
 */
function CreateCioService(objModel, objFilter, objHooks) {
    return new CioService(objModel, objFilter, objHooks);
}

// *****************************************************************************
// Class definition
// *****************************************************************************

/**
 * CioService class to create a service.
 */
class CioService {
    constructor(objModel, objFilter, objHooks) {
        this.objModel  = objModel;
        this.objFilter = objFilter;
        this.objHooks  = objHooks;

        Object.keys(_arrPossibleHooks).forEach(function(strKey) {
            if (!this.objHook[strKey] || 'function' !== typeof this.objHook[strKey]) {
                this.objHook[strKey] = _defaultFunction;
            }
        });
    }
}

// *****************************************************************************

CioService.createDocuments = createDocuments;
CioService.readDocuments   = readDocuments;
CioService.updateDocuments = updateDocuments;
CioService.deleteDocuments = deleteDocuments;

// *****************************************************************************
// Class methods
// *****************************************************************************

/**
 * Service function to cerate documents in the database.
 *
 * @public
 * @param {Object}   objMeta   object for meta information like the session
 * @param {Array}    arrDocs   array of the documents to be created
 * @param {Function} callback  function for callback
 */
function createDocuments(objMeta, arrDocs, callback) {
    var self = this;
    var arrDocsResult = [];

    // outer waterfall
    return async.waterfall(

        // call methods before saving
        self.objHooks.hookCreateBefore(arrDocs, objMeta),

        // outer waterfall callback
        (objErr, arrDocsAlt) => {
            if (objErr) { return _logAndReturn(objErr, callback); }

            // if the documents were modified, use them instead
            arrDocs = arrDocsAlt || arrDocs;

            // traverse over all documents
            return async.eachSeries(arrDocs,

                // action function
                (objDoc, _callback) => {
                    
                    // create a new mongoose object
                    var objDocInst = new self.objModel(objDoc);
                    
                    // save the object and add it to the result array
                    return objDocInst.save(objErr => {
                        if (objErr) { return _logAndReturn(objErr, callback); }

                        // filter the document object
                        if (self.objFilter.filter &&
                                'function' === typeof self.objFilter.filter) {
                            objDocInst = self.objFilter.filter(objDocInst);
                        }

                        arrDocsResult.push(objDocInst);
                        return _callback(null);
                    });
                },

                // eachSeries callback
                (objErr) => {
                    if (objErr) { return _logAndReturn(objErr, callback); }

                    // inner waterfall
                    return async.waterfall(

                        // call methods after saving
                        self.objHooks.hookCreateAfter(arrDocsResult, objMeta),

                        // inner waterfall callback
                        (objErr, arrDocsResultAlt) => {
                            if (objErr) { return _logAndReturn(objErr, callback); }

                            // if the documents were modified, use them instead
                            arrDocsResult = arrDocsResultAlt || arrDocsResult;

                            return callback(null, arrDocsResult);
                        }
                    );
                }
            );
        }
    );
}

// *****************************************************************************

/**
 * Service function to read documents from the database.
 *
 * @public
 * @param {Object}   objMeta   object for meta information like the session
 * @param {Array}    arrDocs   array of the documents with ids
 * @param {Function} callback  function for callback
 */
function readDocuments(objMeta, arrDocs, callback) {
    var self = this;
    var objQueryKey, arrDocKeys;
    var objQuery = {};

    if (_.isArray(arrDocs) && arrDocs.length > 0) {
        objQueryKey = objMeta && objMeta.queryKey || '_id';
        arrDocKeys  = arrDocs.map(objDoc => objDoc[objQueryKey]);

        if (arrDocIds && arrDocIds.length > 0) {
            objQuery[objQueryKey] = { $in: arrDocKeys };
        }
    }

    // defaults for modifiers
    objMeta.modifiers        = objMeta.modifiers        || {};
    objMeta.modifiers.select = objMeta.modifiers.select || '';
    objMeta.modifiers.limit  = objMeta.modifiers.limit  || '';
    objMeta.modifiers.sort   = objMeta.modifiers.sort   || '';

    // outer waterfall
    return async.waterfall(

        // hook for functions before reading
        self.objHooks.hookReadBefore(arrDocs, objMeta),

        // outer waterfall callback
        (objErr, arrDocsAlt) => {
            if (objErr) { return _logAndReturn(objErr, callback); }

            // if documents were changed, use them instead
            arrDocs = arrDocsAlt || arrDocs;

            return self.objModel
                    .find(objQuery)
                    .select(objMeta.modifiers.select)
                    .limit(objMeta.modifiers.limit)
                    .sort(objMeta.modifiers.sort)
                    .exec(_innerWaterfall(objMeta, 'hookReadAfter', callback));
        }
    );
}

// *****************************************************************************

/**
 * Service function to update documents in the database.
 *
 * @public
 * @param {Object}   objMeta   object for meta information like the session
 * @param {Array}    arrDocs   array of the documents to be updated
 * @param {Function} callback  function for callback
 */
function updateDocuments(objMeta, arrDocs, callback) {
    var self       = this;
    var arrDocKeys = [];
    var objQuery, objQueryKey, objUpdate, objOptions;

    // outer waterfall
    return async.waterfall(

        // hook for functions before updating
        self.objHooks.hookUpdateBefore(arrDocs, objMeta),

        // outer waterfall callback
        (objErr, arrDocsAlt) => {
            if (objErr) { return _logAndReturn(objErr, callback); }

            // if documents were changed, use them instead
            arrDocs = arrDocsAlt || arrDocs;

            // eachSeries to travers over the documents
            return async.eachSeries(arrDocs,
            
                // action function
                (objDoc, _callback) => {
                    objQueryKey           = objMeta.queryKey || '_id';
                    objOptions            = objMeta.options  || { multi: true };
                    objQuery[objQueryKey] = objDoc[objQueryKey].toString();
                    objUpdate             = objDoc;

                    if (objUpdate._id) {
                        delete objUpdate._id;
                    }

                    // update the object
                    return self.objModel.update(objQuery, objUpdate, objOptions,
                            (objErr, objModified) => {
                        if (objErr) { return _logAndReturn(objErr, callback); }

                        // add ID to array of IDs
                        arrDocKeys.push(objQuery[objQueryKey]);

                        return _callback(null);
                    });
                },

                // eachSeries callback
                (objErr) => {
                    if (objErr) { return _logAndReturn(objErr, callback); }

                    objQuery              = {};
                    objQuery[objQueryKey] = { $in: arrDocKeys };

                    return self.objModel.find(objQuery,
                            _innerWaterfall(objMeta, 'hookUpdateAfter', callback));
                }
            );
        }
    );
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function for the callback to the inner waterfall, which is always the
 * same: call hook and take the possibly changed documents as return value.
 *
 * @private
 * @param  {Object}   objMeta          object if meta information
 * @param  {String}   strHookFunction  string of the after hook function
 * @param  {Function} callback         function for callback
 * @return {Function}                  function as the callback of the last operation
 */
function _innerWaterfall(objMeta, strHookFunction, callback) {
    return (objErr, arrDocsResult) => {
        if (objErr) { return _logAndReturn(objErr, callback); }
                        
        // inner waterfall
        return async.waterfall(

            // hook for functions after updating
            self.objHooks[strHookFunction](arrDocsResult, objMeta),

            // inner waterfall callback
            (objErr, arrDocsResultAlt) => {
                if (objErr) { return _logAndReturn(objErr, callback); }

                // if documents were changed, use them instead
                arrDocsResult = arrDocsResultAlt || arrDocsResult;

                return callback(null, arrDocsResult);
            }
        ); 
    };
}

// *****************************************************************************

/**
 * Helper function to log the error and return the callback invocation.
 *
 * @private
 * @param {Object}   objErr    object of error
 * @param {Function} callback  function of callback
 */
function _logAndReturn(objErr, callback) {
    console.error(objErr);
    return callback(objErr);
}

// *****************************************************************************

})();