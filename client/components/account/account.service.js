/**
 * @name        CioAccountService
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
    .factory('CioAccountService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service(CioComService) {
    var service = {};

    // *************************************************************************
    // Private variables
    // *************************************************************************

    var _strUrlUserRead            = '/user/read';
    var _strUrlUserUpdate          = '/user/update';
    var _strUrlUserDelete          = '/user/delete';
    var _strUrlUserUpdatePasswords = '/user/update-password';
    var _strVerifyEmail            = '/send-verification-email';

    // *************************************************************************
    // Public variables
    // *************************************************************************

    service.objUser = {};

    // *************************************************************************
    // Service function linking
    // *************************************************************************

    service.processUser           = processUser;
    service.processPasswords      = processPasswords;
    service.deleteUser            = deleteUser;
    service.sendVerificationEmail = sendVerificationEmail;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************

    /**
     * Service method to read, update or delete the user on/from server.
     * @public
     * 
     * @param {Object}   [mixData]  (optional) data object with either 'delete'
     *                              or user object to be updated
     * @param {Function} callback   function for callback
     */
    function processUser(mixData, callback) {
        var strUrl, objRequest;

        if ('function' === typeof mixData && !callback) {
            callback = mixData;
        }
        else if ('function' !== typeof callback) {
            callback = function(){};
        }

        // URL depends on action to be performed
        strUrl = 'delete'   ===        mixData && _strUrlUserDelete ||
                 'object'   === typeof mixData && _strUrlUserUpdate ||
                 'function' === typeof mixData && _strUrlUserRead;

        objRequest = {
            id  : 'process-user',
            url : strUrl,
        };

        // in case of an update, add user object to request
        if (strUrl === _strUrlUserUpdate) {
            objRequest.data = { user: mixData };
        }

        return CioComService.put(objRequest, function(objErr, objUser) {
            if (objErr) {
                return callback(objErr);
            }
            if (objUser) {
                service.objUser = objUser;
            }
            return callback(null, objUser);
        });
    }

    // *************************************************************************

    /**
     * Service function to update the user's password.
     *
     * @public
     * @param {Object}   objPasswords                  object of the passwords
     * @param {String}   objPasswords.passwordCurrent  string of the user's current password
     * @param {String}   objPasswords.passwordNew      string of the user's new password
     * @param {Function} callback                      function for callback
     */
    function processPasswords(objPasswords, callback) {
        var objRequest = {
            id  : 'process-passwords',
            url : _strUrlUserUpdatePasswords,
            data: { passwords: objPasswords },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to delete the user.
     *
     * @public
     * @param {String}   strPassword  string of the user's current password
     * @param {Function} callback     function for callback
     */
    function deleteUser(strPassword, callback) {
        var objRequest = {
            id  : 'delete-user',
            url : _strUrlUserDelete,
            data: { password: strPassword },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to send the verification email.
     *
     * @public
     * @param {Function} callback  function for callback
     */
    function sendVerificationEmail(callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id : 'send-verification-email',
            url: _strVerifyEmail,
        };
        return CioComService.put(objRequest, function(objErr, objUser) {
            if (objErr) {
                return callback(objErr);
            }
            service.objUser = objUser;
            return callback(null, objUser);
        });
    }

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

    // *************************************************************************

    return service;

    // *************************************************************************
}

// *****************************************************************************

})();
