(function() { 'use strict';

// *****************************************************************************
// Exports
// *****************************************************************************

global.setError = setError;

// *****************************************************************************
// Error functions
// *****************************************************************************

/**
 * Error function to create an error from an info string.
 * The given string has the form:
 *
 *     "<statusCode>|<id>|<message>"
 * 
 * An example looks like:
 *
 *     "500|COMMON.GENERAL|An unexpected error occurred." or
 *     "500|ERROR.COMMON.GENERAL|An unexpected error occurred."
 *     
 *
 * @public
 * @param {String} strInfo  string of the info combination
 */
function setError(strInfo) {
    var arrInfo       = strInfo.split('|');
    var numStatusCode = arrInfo[0]|0;
    var strId         = arrInfo[1].replace(/^(errors\.|error\.)\_?/i, '').toUpperCase();
    var strMessage    = arrInfo[2];
    var arrObjNames   = strId.split('.');
    var i, strKey, objErr;

    if (!global.ERRORS) {
        global.ERRORS = {};
    }

    strId  = 'ERRORS.' + strId;
    objErr = {
        statusCode: numStatusCode,
        id        : strId,
        message   : strMessage.trim(),
    };

    function _setSubObject(objCurrent, arrKeys) {
        strKey = arrKeys.shift();
        if (!objCurrent[strKey]) {
            objCurrent[strKey] = {};
        }
        if (arrKeys.length === 0) {
            return (objCurrent[strKey] = objErr);
        }
        return _setSubObject(objCurrent[strKey], arrKeys);
    } _setSubObject(global.ERRORS, arrObjNames);
}

// *****************************************************************************
// Setting up errors
// *****************************************************************************

require('../components/common/common.errors.js');
require('../components/auth/auth.errors.js');

// console.log("ERRORS:", JSON.stringify(global.ERRORS, null, 2), '\n\n');

// *****************************************************************************

})();