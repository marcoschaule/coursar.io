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

function Service(CioComService) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _strStateRedirect     = 'home';
    var _strUrlSignIn         = '/sign-in';
    var _strUrlSignUp         = '/sign-up';
    var _strUrlForgotPassword = '/forgot-password';
    var _strUrlResetPassword  = '/reset-password';
    var _strUrlIsAvailable    = '/is-available';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.isSignedIn = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn           = signIn;
    service.signUp           = signUp;
    service.forgotPassword   = forgotPassword;
    service.resetPassword    = resetPassword;
    service.testAvailability = testAvailability;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Service function to sign user in. In case of success, the service
     * provides a variable "isSignedIn".
     * 
     * @param {Object}   objData                 object of user data to sign in
     * @param {Object}   objData.username        string of user name
     * @param {Object}   objData.password        string of user password
     * @param {Object}   [objData.isRemembered]  (optional) true if user wants to stay signed in
     * @param {Function} callback                function for callback
     */
    function signIn(objData, callback) {
        var objRequest = {
            id       : 'sign-in',
            url      : _strUrlSignIn,
            data     : objData,
            isTimeout: true,
        };

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
     * 
     * @param {Object}   objData                 object of user data to sign in
     * @param {Object}   objData.username        string of user name
     * @param {Object}   objData.email           string of user email
     * @param {Object}   objData.password        string of user password
     * @param {Object}   [objData.isRemembered]  (optional) true if user wants to stay signed in
     * @param {Function} callback                function for callback
     */
    function signUp(objData) {
        var objRequest = {
            id       : 'sign-up',
            url      : _strUrlSignUp,
            data     : objData,
            isTimeout: true,
        };

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
     * Service function to send an email if user forgot password.
     * 
     * @param {Object}   objData        object of user data
     * @param {String}   objData.email  string of user email from account
     * @param {Function} callback       function for callback
     */
    function forgotPassword(objData, callback) {
        if (!callback || 'function' !== typeof callback) {
            callback = function() {};
        }
        var objRequest = {
            id       : 'forgot-password',
            url      : _strUrlForgotPassword,
            data     : objData,
        };
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send the new password and the Redis id to
     * change the password.
     * 
     * @param {Object}   objData        object of user data
     * @param {String}   objData.email  string of user email from account
     * @param {Function} callback       function for callback
     */
    function resetPassword(objData, callback) {
        if (!callback || 'function' !== typeof callback) {
            callback = function() {};
        }
        var objRequest = {
            id       : 'reset-password',
            url      : _strUrlResetPassword,
            data     : objData,
        };
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to test if username or email is available.
     * 
     * @param {String}   strWhich  string of either "username" or "email"
     * @param {Obejct}   objData   object of user data
     * @param {Function} callback  function for callback
     */
    function testAvailability(strWhich, objData, callback) {
        if (!callback || 'function' !== typeof callback) {
            callback = function() {};
        }
        var objRequest = {
            id       : 'is-available-' + strWhich,
            url      : _strUrlIsAvailable,
            data     : objData,
            isTimeout: true,
        };
        return CioComService.put(objRequest, callback);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['CioComService'];

// *****************************************************************************

})();
