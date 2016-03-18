(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var User = require('../auth/auth.schema.js').Auth;

// *****************************************************************************
// Service functions
// *****************************************************************************

/**
 * Service method to get the "public" user data.
 * 
 * @public
 * @param {String}   strUserId  string of request user's id
 * @param {Function} callback   function for callback
 */
function readUser(strUserId, callback) {
    callback = 'function' === typeof callback && callback || function(){};

    var objUserResult;

    return User.findOne({ _id: strUserId }, (objErr, objUser) => {
        if (objErr) {
            return callback(objErr);
        }
        if (!objUser || !objUser._id || !objUser.username || !objUser.email) {
            return callback(true);
        }

        objUserResult = {
            _id       : objUser._id.toString(),
            profile   : objUser.profile,
            username  : objUser.username,
            email     : objUser.email,
            isVerified: objUser.isVerified,
        };

        return callback(null, objUserResult);
    });
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readUser = readUser;

// *****************************************************************************

})();
