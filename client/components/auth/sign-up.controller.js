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

function Controller($timeout, $state, CioComService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************
    
    var _objTimeouts       = {};
    var _numTimeoutDefault = 400; // timeout in milliseconds

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelSignUp = {};
    vm.formSignUp  = {};
    vm.flags = {
        isProcessing: false,
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
        _resetTimeoutsSync();
    } init();

    // *****************************************************************************

    function signUp() {
        var objData;

        // activate processing to deactivate interaction with form
        vm.flags.isProcessing = true;
        
        // cancel timeout of previous sign up request
        $timeout.cancel(_objTimeouts.signUp);

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

        return (_objTimeouts.signUp = $timeout(function() {
            return CioComService.put('/sign-up', objData, function(objErr, objData) {

                // delete timeout promise again
                _objTimeouts.signUp = null;

                // activate interaction with form again
                vm.flags.isProcessing = false;

                // redirect to the user defined entry page

            });
        }, _numTimeoutDefault));
    }

    // *****************************************************************************

    function isAvailable(strWhich, strValue) {
        var objFormField  = vm.formSignUp['signUp' + _capitalize(strWhich)];
        var strViewValue  = objFormField.$viewValue;
        var strModelValue = objFormField.$modelValue;
        var objData;

        // cancel timeout of previous availability test
        $timeout.cancel(_objTimeouts[strWhich]);

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

        // set text to "pending"
        _setTextForAvailability(objFormField, strWhich, 'pending');

        // set timeout not to send every key stroke to the backend
        return (_objTimeouts[strWhich] = $timeout(function() {
            return CioComService.put('/is-available', objData, function(objErr, ObjData) {
                    
                // set text to "available" or "not available"
                _setTextForAvailability(objFormField, strWhich,
                        !!(ObjData && ObjData.isAvailable));

                // delete timeout promise again
                _objTimeouts[strWhich] = null;
            });
        }, _numTimeoutDefault));
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _resetTimeoutsSync() {
        $timeout.cancel(_objTimeouts.signUp);
        $timeout.cancel(_objTimeouts.username);
        $timeout.cancel(_objTimeouts.email);
        _objTimeouts.signUp   = null;
        _objTimeouts.username = null;
        _objTimeouts.email    = null;
    }

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
