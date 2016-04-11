(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var ContentService = require('./content.service.js');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.handleContent = handleContent;

// *****************************************************************************
// Controller functions
// *****************************************************************************

function handleContent(req, res, next) {
    var strTarget    = req.body.target;
    var objData      = req.body.data      || null;
    var objModifiers = req.body.modifiers || {};
    var arrArgs      = [objData, __callback];
    var isSingular   = 's' !== strTarget.charAt(strTarget.length-1);

    if (!strTarget || !ContentService[strTarget]) {
        return next(new Error('Target not defined in service!'));
    }
    if ('readUsers' === strTarget) {
        arrArgs.splice(1, 0, objModifiers);
    }
    return UserAdminController[strTarget].apply(UserAdminController, arrArgs);

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