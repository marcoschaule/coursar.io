(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var UserAdminService = require('./user-admin.service.js');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.handleRequest = handleRequest;

// *****************************************************************************
// Controller functions
// *****************************************************************************

/**
 * Controller function to create a user.
 *
 * @public
 * @param {Object}   req                 object of the standard Express request
 * @param {Object}   req.body            object of the request body
 * @param {Object}   req.body.data       object of the payload for create, update or delete
 * @param {String}   req.body.target     string of the target function to be called in service
 * @param {Object}   req.body.modifiers  object of the modifiers to be used when querying for users
 * @param {Object}   res                 object of the standard Express response
 * @param {Function} next                function for calling the next middleware
 */
function handleRequest(req, res, next) {
    var strTarget    = req.body.target;
    var objData      = req.body.data      || null;
    var objModifiers = req.body.modifiers || {};
    var arrArgs      = [objData, __callback];
    var isSingular   = 's' !== strTarget.charAt(strTarget.length-1);

    if (!strTarget || !UserAdminService[strTarget]) {
        return next();
    }
    if ('readUsers' === strTarget) {
        arrArgs.splice(1, 0, objModifiers);
    }
    return UserAdminService[strTarget].apply(UserAdminService, arrArgs);

    function __callback(objErr, mixUsers) {
        if (objErr) {
            return next(objErr);
        }
        if (isSingular) {
            return res.status(200).json({ err: null, objUser: mixUsers });
        }
        return res.status(200).json({ err: null, arrUsers: mixUsers });
    }
}

// *****************************************************************************

})();