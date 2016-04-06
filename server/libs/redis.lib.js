(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var uuid  = require('uuid');
var redis = global.clients.redis;

// *****************************************************************************
// Library function definitions
// *****************************************************************************

/**
 * Library function to generate a Redis entry for
 * the "reset password" scenario.
 * 
 * @public
 * @param {String}   strUserId  string of MongoDB user ID
 * @param {Function} callback   function for callback
 */
function setRedisEntryForEmailVerification(strUserId, callback) {
    return _setRedisEntryForEmailVerificationOrPasswordReset(
            'ever:', strUserId, callback);
}

// *****************************************************************************

/**
 * Library function to generate a Redis entry for
 * the "reset password" scenario.
 * 
 * @public
 * @param {String}   strUserId  string of MongoDB user ID
 * @param {Function} callback   function for callback
 */
function setRedisEntryForPasswordReset(strUserId, callback) {
    return _setRedisEntryForEmailVerificationOrPasswordReset(
            'resp:', strUserId, callback);
}

// *****************************************************************************

/**
 * Library function to delete a Redis entry.
 * 
 * @public
 * @param {String}   strKey    string of the Redis key
 * @param {Function} callback  function for callback
 */
function getRedisEntry(strKey, callback) {
    return _performDefaultQuery('get', strKey, callback);
}

// *****************************************************************************

/**
 * Library function to delete a Redis entry.
 * 
 * @public
 * @param {String}   strKey    string of the Redis key
 * @param {Function} callback  function for callback
 */
function deleteRedisEntry(strKey, callback) {
    return redis.del(strKey, objErr => callback(objErr));
}

// *****************************************************************************
// Helper function definitions
// *****************************************************************************

/**
 * Helper function to set the Redis entry with expiration.
 * 
 * @private
 * @param {String}   strKey     string of the Redis entry key
 * @param {String}   strHash    string of the Redis entry hash
 * @param {Number}   numMaxAge  number of the max time of the Redis entry
 * @param {Function} callback   function for callback
 */
function _setexRedisEntry(strKey, strHash, numMaxAge, callback) {
    return redis.setex(strKey, numMaxAge, strHash, objErr => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null);
    });
}

// *****************************************************************************

/**
 * Helper function to set a Redis entry for either "email verification"
 * or "password reset" scenario.
 * 
 * @private
 * @param {String}   strKeyPrefix  string of Redis key prefix
 * @param {String}   strUserId     string of MongoDB user ID
 * @param {Function} callback      function for callback
 */
function _setRedisEntryForEmailVerificationOrPasswordReset(
        strKeyPrefix, strUserId, callback) {
    var strHash, strRId, numMaxAge, strKey;

    if (!callback || 'function' !== typeof callback) {
        callback = function() {};
    }

    numMaxAge = settings.auth.resetPassword.maxAge;
    strRId    = uuid.v4();
    strKey    = strKeyPrefix + strRId;
    strHash   = JSON.stringify({
        userId   : strUserId.toString(),
        createdAt: Date.now(),
    });
    
    return _setexRedisEntry(strKey, strHash, numMaxAge, objErr => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, strRId);
    });
}

// *****************************************************************************

/**
 * Helper function to perform a default query.
 * 
 * @private
 * @param {String}   strAction  string of an action like "get", "del" etc.
 * @param {String}   strKey     string of the Redis key "resp:some-key-idenfifier"
 * @param {Function} callback   function for callback
 */
function _performDefaultQuery(strAction, strKey, callback) {
    return redis[strAction](strKey, (objErr, objReply) => {
        if (objErr) {
            return callback(objErr);
        }
        else if (!objReply) {
            return callback({
                err: settings.errors.verifyEmail.sessionExpired,
                disableRepeater: true,
            });
        }
        return callback(null, objReply && JSON.parse(objReply));
    });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setRedisEntryForEmailVerification = setRedisEntryForEmailVerification;
module.exports.setRedisEntryForPasswordReset     = setRedisEntryForPasswordReset;
module.exports.getRedisEntry                     = getRedisEntry;
module.exports.deleteRedisEntry                  = deleteRedisEntry;

// *****************************************************************************

})();