(function() { 'use strict';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.getRequestInfo = getRequestInfo;

// *****************************************************************************
// Library functions
// *****************************************************************************

/**
 * Library function to gather the request information like IP and user agent.
 *
 * @private
 * @param  {Object} req          object of express default request
 * @param  {Object} req.headers  object of the user request header
 * @return {Object}              object of the request info
 */
function getRequestInfo(req) {
    var objInfo = {
        ua: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress,
    };

    return objInfo;
}

// *****************************************************************************

})();