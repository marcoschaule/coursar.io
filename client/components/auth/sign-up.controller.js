/**
 * @name        CioSignUpCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README.md
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-controllers')
    .controller('CioSignUpCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($timeout, $state, CioAuthService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************
    
    var _strStateRedirect  = '/';
    var _strUrlSignUp      = '/sign-up';
    var _strUrlIsAvailable = '/is-available';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelSignUp = {};
    vm.formSignUp  = {};
    vm.flags = {
        isAvailable : {
            username: 'pristine',
            email   : 'pristine',
        },
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init        = init;
    vm.signUp      = signUp;
    vm.isAvailable = isAvailable;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function init() {
    } init();

    // *****************************************************************************

    function signUp() {
        var objData;

        // if form is (still) not valid, yet, do nothing
        if (vm.formSignUp.$invalid) {
            return;
        }

        objData = {
            username    :   vm.modelSignUp.username,
            email       :   vm.modelSignUp.email,
            password    :   vm.modelSignUp.password,
            isRemembered: !!vm.modelSignUp.isRemembered,
        };

        return CioAuthService.signUp(objData, function(objErr, objData) {
            if (objErr) {
                return;
            }

            // redirect to the user defined entry page
            $state.go(_strStateRedirect);
        });
    }

    // *****************************************************************************

    function isAvailable(strWhich, strValue) {
        var objFormField  = vm.formSignUp['signUp' + _capitalize(strWhich)];
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

Controller.$inject = ['$timeout', '$state', 'CioComService'];

// *****************************************************************************

})();
