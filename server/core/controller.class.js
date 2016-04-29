/**
 * Documents for create:
 *     var arrDocs = [{ ... }];
 * Documents for read:
 *     var arrDocs = [{ id: .., ... }];
 * Documents for update:
 *     var arrDocs = [{ id: .., ... }];
 * Documents for delete:
 *     var arrDocs = [{ id: .. }];
 */
(function() { 'use strict';
/*jshint validthis:true */

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var _     = require('underscore');
var async = require('async');

// *****************************************************************************
// Factory
// *****************************************************************************

/**
 * CioController factory function to create an object instance.
 *
 * @public
 * @param  {Object}   app              object of the Express application to add
 *                                     the common route to it
 * @param  {Object}   objService       object of the service that is used within
 *                                     this controller
 * @param  {String}   strNamespace     string of the namespace and also the route
 *                                     within this controller
 * @param  {Object}   objHooks         object of the hook functions
 * @param  {Function} objHooks.before  function hook that returns and array of
 *                                     functions in an "async.waterfall" that are
 *                                     called before invoking the corresponding
 *                                     service method
 * @param  {Function} objHooks.after   function hook that returns and array of
 *                                     functions in an "async.waterfall" that are
 *                                     called after invoking the corresponding
 *                                     service method
 * @return {Object}                    object instance of the controller
 */
function CreateCioController(app, objService, strNamespace, objHooks) {
    return new CioController(app, objService, strNamespace, objHooks);
}

// *****************************************************************************
// Class definition
// *****************************************************************************

/**
 * CioController class to create a controller.
 */
class CioController {
    constructor(app, strNamespace, objService, objHooks) {
        var defaultFunction = function() { return []; };

        this.strNamespace = strNamespace;
        this.objService   = objService;
        this.hookBefore   = objHooks.before;
        this.hookAfter    = objHooks.after;

        if ('function' !== typeof this.hookBefore) {
            this.hookBefore = defaultFunction;
        } 
        if ('function' !== typeof this.hookAfter) {
            this.hookAfter = defaultFunction;
        } 

        // setup common route
        app.put(this.strNamespace, this.handleRequest);
    }
}

// *****************************************************************************
// Class methods
// *****************************************************************************

/**
 * CioController method to handle each incoming request. Each incoming request
 * has one of the four body objects: "create", "read", "update" or "delete".
 * Each of them can either be an object for single processing or an array for
 * multiple processing.
 * 
 * @public
 * @param {Object}   req                object of default Express request
 * @param {Object}   req.body           object of default Express request body
 * @param {Object}   [req.body.create]  (optional) object for a create process
 * @param {Object}   [req.body.read]    (optional) object for a read process
 * @param {Object}   [req.body.update]  (optional) object for a update process
 * @param {Object}   [req.body.delete]  (optional) object for a delete process
 * @param {Object}   res                object of default Express response
 * @param {Function} next               function for next Express middleware
 */
function handleRequest(req, res, next) {
    var self = this;
    var mixAction, strAction, strActionMethod, objModifiers, objMeta, arrDocs,
        wrapper;
    
    if (req.body.create) {
        strAction = 'create';
    }
    if (req.body.read) {
        strAction = 'read';
    }
    if (req.body.update) {
        strAction = 'update';
    }
    if (req.body.delete) {
        strAction = 'delete';
    }

    strActionMethod = strAction + 'Document';
    mixAction       = req.body[strAction];
    arrDocs         = !_.isArray(mixAction) ? [mixAction] : mixAction;
    objModifiers    = req.body.modifiers || {};
    objMeta         = _.extend({}, objModifiers, { session: req.session });

    if (!self.objService[strActionMethod]) {
        throw new Error('Service method does not exist!');
    }

    // outer waterfall
    return async.waterfall(

        // array of functions called before the service operation
        self.hookBefore(arrDocs, objMeta),

        // outer waterfall callback
        (objErr, arrDocsAlt) => {
            if (objErr) {
                return next(objErr);
            }

            // if the array of documents were changed, use them instead
            arrDocs = arrDocsAlt || arrDocs;

            return self.objService[strActionMethod](objMeta, arrDocs,
                    (objErr, arrDocsResult) => {
                if (objErr) {
                    return next(objErr);
                }

                // inner waterfall
                return async.waterfall(

                    // array of functions called after the service operation
                    self.hookAfter(arrDocsResult, objMeta),

                    // inner waterfall callback
                    (objErr, arrDocsResultAlt) => {
                        if (objErr) {
                            return next(objErr);
                        }

                        // if the array of documents were changed, use them instead
                        arrDocsResult = arrDocsResultAlt || arrDocsResult;

                        return res.status(200).json({
                            err : null,
                            docs: arrDocsResult || null,
                        });
                    });

            });
        });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************

})();