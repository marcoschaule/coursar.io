(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var async            = require('async');
var AuthService      = require('./auth.service.js');
var AuthAdminService = require('./auth-admin.service.js');
var libRequest       = require('../../libs/request.lib.js');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn    = signIn;
module.exports.authorize = authorize;

// *****************************************************************************
// Controller functions
// *****************************************************************************

/**
 * Controller function to first check the given key and then sign the user in
 * if the userdata is correct.
 *
 * @public
 * @param {Object}   req              object of Express request
 * @param {Object}   req.body         object of request body
 * @param {String}   req.body.field1  string of new user's key
 * @param {String}   req.body.field2  string of new user's username
 * @param {String}   req.body.field3  string of new user's password
 * @param {Object}   res              object of Express response
 * @param {Function} next             function of callback for next middleware
 */
function signIn(req, res, next) {
    var objData = req.body;
    var objUser, objInfo, objProfileReturn;

    // create user object
    objUser = {
        username: objData.field2,
        password: objData.field3,
    };

    // create object for additional (user) information
    objInfo = libRequest.getRequestInfo(req);

    return async.waterfall([
    
        // check key
        (_callback) => {
            return AuthAdminService.checkKey(objData.field1, objErr => {
                if (objErr) {
                    return _callback({ err: objErr, disableRepeater: true });
                }
                return _callback(null);
            });
        },

        // check admin
        (_callback) => {
            return AuthAdminService.checkAdmin(objData.field2, objErr => {
                if (objErr) {
                    return _callback({ err: objErr, disableRepeater: true });
                }
                return _callback(null);
            });
        },

        // sign in
        (_callback) => {
            return AuthService.signIn(objUser, objInfo, req.session,
                    (objErr, objProfile, strToken) => {
                
                if (objErr) {
                    return _callback({ err: objErr, disableRepeater: true });
                }
                res.set('X-Access-Token', strToken);
                objProfileReturn = objProfile;
                return _callback(null);
            });
        },

    // waterfall callback
    ], objErr => {
        if (objErr) {
            return next(objErr);
        }
        return res.status(200).json({ err: null, user: objProfileReturn });
    });
}

// *****************************************************************************
// Middleware functions
// *****************************************************************************

/**
 * Middleware function to authorize requests, add headers, check if they are
 * signed in and if not, inform client to redirect.
 * 
 * @public
 * @param {Object}   req   object of express default request
 * @param {Object}   res   object of express default response
 * @param {Function} next  function for next middleware
 */
function authorize(req, res, next) {
    var objInfo = libRequest.getRequestInfo(req);

    return AuthAdminService.checkSignedIn(req.session, objInfo, objErr => {
        if (objErr) {
            res.set('X-Access-Token', 'delete');
            return next({ err: objErr, redirect: true });
        }
        
        // set access token and CSRF token in header
        res.set('X-Access-Token', req.session.jwt);

        return next(null);
    });
}

// *****************************************************************************

})();