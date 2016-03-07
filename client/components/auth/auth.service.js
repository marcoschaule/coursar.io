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

    var _strStateRedirect  = 'home';
    var _strUrlSignIn      = '/sign-in';
    var _strUrlSignUp      = '/sign-up';
    var _strUrlIsAvailable = '/is-available';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.isSignedIn = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn           = signIn;
    service.signUp           = signUp;
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
     * Service function to test if username or email is available.
     * 
     * @param {String}   strWhich  string of either "username" or "email"
     * @param {Obejct}   objData   object of user data
     * @param {Function} callback  function for callback
     */
    function testAvailability(strWhich, objData, callback) {
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
