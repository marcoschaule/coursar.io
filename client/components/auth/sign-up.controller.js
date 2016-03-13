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
    
    var _strStateRedirect  = 'accountProfile';
    var _strUrlSignUp      = '/sign-up';
    var _strUrlIsAvailable = '/is-available';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelSignUp = {};
    vm.formSignUp  = {};
    vm.states = {
        username: 'pristine',
        email   : 'pristine',
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.signUp      = signUp;
    vm.isAvailable = isAvailable;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to sign the user up.
     */
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

    /**
     * Controller function to test if "username" or "email" is available.
     * 
     * @param {String} strWhich  string of which to test
     */
    function isAvailable(strWhich) {
        var strWhichL      = strWhich.toLowerCase();
        var strFieldForm   = 'signUp' + strWhich;
        var objFormField   = vm.formSignUp[strFieldForm];
        var objData, objRequest;

        // set manually the validity if each field to "true"
        objFormField.$setValidity('isAvailable', true);

        // test if there are any errors in the form
        if (objFormField.$error.required) {
            return (vm.states[strWhichL] = 'required');
        }
        if (objFormField.$error.minlength) {
            return (vm.states[strWhichL] = 'tooShort');
        }
        if (objFormField.$error.maxlength) {
            return (vm.states[strWhichL] = 'tooLong');
        }
        if (objFormField.$error.email) {
            return (vm.states[strWhichL] = 'invalid');
        }

        // set the state of the field to "pending" since the request
        // is about to get fired
        vm.states[strWhichL] = 'pending';
        
        objData            = {};
        objData[strWhichL] = objFormField.$viewValue;

        return CioAuthService.testAvailability(strWhichL, objData, function(objErr, objData) {
            if (objErr || !objData) {
                return (vm.states[strWhichL] = 'error');
            }

            // set manually the validity if each field depending on result
            objFormField.$setValidity('isAvailable', !!objData.isAvailable);

            // set the state of the field depending on result
            vm.states[strWhichL] = !!objData.isAvailable && 'available' || 'notAvailable';
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$timeout', '$state', 'CioAuthService'];

// *****************************************************************************

})();
