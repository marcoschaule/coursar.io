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

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.isSignedIn = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn = signIn;
    service.signUp = signUp;

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

    function isAvailable(objFormField, strWhich, strValue) {
        // var objFormField  = vm.formSignUp['signUp' + _capitalize(strWhich)];
        var strViewValue  = objFormField.$viewValue;
        var strModelValue = objFormField.$modelValue;
        var objData, objRequest;

        // set the validity of the form field to "invalid"
        objFormField.$setValidity('isNotAvailable', false);

        // if user did not enter any text or text is
        // not valid, reset to pristine
        if (!strViewValue) {
            return _setTextForAvailability(objFormField, strWhich, 'pristine');
        }

        // is view value is set, but model value is not (since the input
        // is not valie), set the availability text to "invalid", too
        if (strViewValue && !strModelValue) {
            return _setTextForAvailability(objFormField, strWhich, 'invalid');
        }

        objData           = {};
        objData[strWhich] = strViewValue;
        objRequest = {
            id       : 'is-available-' + strWhich,
            url      : _strUrlIsAvailable,
            data     : objData,
            isTimeout: true,
        };

        // set text to "pending"
        _setTextForAvailability(objFormField, strWhich, 'pending');

        return CioComService.put(objRequest, function(objErr, ObjData) {
                
            // set text to "available" or "not available"
            _setTextForAvailability(objFormField, strWhich,
                    !!(ObjData && ObjData.isAvailable));
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _setTextForAvailability(objFormField, strWhich, mixValue) {
        var isAvailableLocal = !!mixValue;

        if (objFormField.$invalid && !objFormField.$error.isNotAvailable) {
            return (vm.flags.isAvailable[strWhich] = 'invalid');
        }
        if ('boolean' !== typeof mixValue) {
            return (vm.flags.isAvailable[strWhich] = mixValue);
        }

        // set availability
        vm.flags.isAvailable[strWhich] = 

            // if field is pristine
            (objFormField.$pristine && 'pristine') ||

            // if field is dirty but empty
            (objFormField.$dirty && !objFormField.$modelValue && 'pristine') ||

            // if field is dirty, but available
            (objFormField.$dirty && isAvailableLocal && true) ||

            // default value
            false;

        // set manually the validity if each field to "false" is not available
        objFormField.$setValidity('isNotAvailable',
            vm.flags.isAvailable[strWhich] === true);
    }

    // *****************************************************************************

    function _capitalize(strSrc) {
        return strSrc.substr(0,1).toUpperCase() + strSrc.substr(1).toLowerCase();
    }

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['CioComService'];

// *****************************************************************************

})();
