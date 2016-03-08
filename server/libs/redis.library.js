(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var uuid  = require('uuid');
var redis = clients.redis;

// *****************************************************************************
// Library function definitions
// *****************************************************************************

// *****************************************************************************

function setRedisEntryForPasswordReset(strEmail, strUserId, callback) {
    var objHash, strHash, strRId, numMaxAge;

    if (!callback || 'function' !== callback) {
        callback = function() {};
    }

    numMaxAge = settings.auth.resetPassword.maxAge;
    strRId    = uuid.v4();
    objHash   = {
        userId   : strUserId.toString(),
        createdAt: Date.now(),
    };
    strHash   = JSON.stringify(objHash);
    
    return redis.setex('resp:' + strRId, numMaxAge, strHash, objErr => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, strRId);
    });
}

// *****************************************************************************

function _getUserIdFromResetPasswordRedisEntry(strRId, callback) {
    return clients.redis.get('resp:' + strRId, (objErr, objReply) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, JSON.parse(objReply));
    });
}

// *****************************************************************************

function _deleteResetPasswordRedisEntry(strRId, callback) {
    return clients.redis.del('resp:' + strRId, (objErr) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null);
    });
}

// *****************************************************************************

})();