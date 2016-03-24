/**
 * @name        CioAuthService
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS service.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-services')
    .factory('CioAuthService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service(CioComService) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _strStateRedirect     = 'signIn';
    var _strUrlSignIn         = '/sign-in';
    var _strUrlSignUp         = '/sign-up';
    var _strUrlSignOut        = '/sign-out';
    var _strUrlVerifyEmail    = '/verify-email';
    var _strUrlForgotUsername = '/forgot-username';
    var _strUrlForgotPassword = '/forgot-password';
    var _strUrlResetPassword  = '/reset-password';
    var _strUrlIsAvailable    = '/is-available';
    var _strUrlIsSignedIn     = '/is-signed-in';
    var _strUrlUserCreate     = '/user/create';
    var _strUrlUserRead       = '/user/read';
    var _strUrlUserUpdate     = '/user/update';
    var _strUrlUserDelete     = '/user/delete';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.isSignedIn = false;
    service.user       = null;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn           = signIn;
    service.signUp           = signUp;
    service.signOut          = signOut;
    service.verifyEmail      = verifyEmail;
    service.forgotUsername   = forgotUsername;
    service.forgotPassword   = forgotPassword;
    service.resetPassword    = resetPassword;
    service.getUser          = getUser;
    service.testAvailability = testAvailability;
    service.testSignedIn     = testSignedIn;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Service function to sign user in. In case of success, the service
     * provides a variable "isSignedIn".
     * @public
     * 
     * @param {Object}   objData                 object of user data to sign in
     * @param {Object}   objData.username        string of user name
     * @param {Object}   objData.password        string of user password
     * @param {Object}   [objData.isRemembered]  (optional) true if user wants to stay signed in
     * @param {Function} callback                function for callback
     */
    function signIn(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'sign-in',
            url      : _strUrlSignIn,
            data     : objData,
            isTimeout: true,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, function(objErr, objData) {
            if (objErr) {
                return callback(objErr);
            }

            service.isSignedIn = true;

            return ('function' === typeof callback && callback(null, objData));
        });
    }

    // *****************************************************************************

    /**
     * Service function to sign user up and in afterwards. In case of success,
     * the service provides a variable "isSignedIn".
     * @public
     * 
     * @param {Object}   objData                 object of user data to sign in
     * @param {Object}   objData.username        string of user name
     * @param {Object}   objData.email           string of user email
     * @param {Object}   objData.password        string of user password
     * @param {Object}   [objData.isRemembered]  (optional) true if user wants to stay signed in
     * @param {Function} callback                function for callback
     */
    function signUp(objData, callback) {
        var objRequest = {
            id       : 'sign-up',
            url      : _strUrlSignUp,
            data     : objData,
            isTimeout: true,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, function(objErr, objData) {
            if (objErr) {
                return callback(objErr);
            }

            service.isSignedIn = true;

            return ('function' === typeof callback && callback(null, objData));
        });
    }

    // *****************************************************************************

    /**
     * Service function to sign out a user.
     */
    function signOut(callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'sign-out',
            url      : _strUrlSignOut,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function verify the user's email.
     * @public
     * 
     * @param {Object}   objData      object of user data
     * @param {String}   objData.rid  string of Redis session ID
     * @param {Function} callback     function for callback
     */
    function verifyEmail(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'verify-email',
            url      : _strUrlVerifyEmail,
            data     : objData,
        };
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send an email if user forgot username.
     * @public
     * 
     * @param {Object}   objData        object of user data
     * @param {String}   objData.email  string of user email from account
     * @param {Function} callback       function for callback
     */
    function forgotUsername(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'forgot-username',
            url      : _strUrlForgotUsername,
            data     : objData,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send an email if user forgot password.
     * @public
     * 
     * @param {Object}   objData        object of user data
     * @param {String}   objData.email  string of user email from account
     * @param {Function} callback       function for callback
     */
    function forgotPassword(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'forgot-password',
            url      : _strUrlForgotPassword,
            data     : objData,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send the new password and the Redis id to
     * change the password.
     * @public
     * 
     * @param {Object}   objData        object of user data
     * @param {String}   objData.email  string of user email from account
     * @param {Function} callback       function for callback
     */
    function resetPassword(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'reset-password',
            url      : _strUrlResetPassword,
            data     : objData,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to get user from server.
     * @public
     * 
     * @param {Function} callback  function for callback
     */
    function getUser(callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id : 'get-user',
            url: _strUrlUserRead,
        };
        return CioComService.put(objRequest, function(objErr, objUser) {
            if (objErr) {
                return callback(objErr);
            }
            
            service.user       = objUser;
            service.isSignedIn = true;
            
            return callback(null, service.isSignedIn);
        });
    }

    // *****************************************************************************

    /**
     * Service function to test if username or email is available.
     * @public
     * 
     * @param {String}   strWhich  string of either "username" or "email"
     * @param {Object}   objData   object of user data
     * @param {Function} callback  function for callback
     */
    function testAvailability(strWhich, objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id       : 'is-available-' + strWhich,
            url      : _strUrlIsAvailable,
            data     : objData,
            isTimeout: true,
        };
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to test if user is signed in. If not, try to sign in
     * user by requesting server.
     * @public
     * 
     * @param {Function} callback  function for callback
     */
    function testSignedIn(callback) {
        callback = 'function' === typeof callback && callback || function(){};

        if (service.isSignedIn) {
            return callback(null, !!service.isSignedIn);
        }
        return getUser(callback);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
