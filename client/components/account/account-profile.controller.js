/**
 * @name        CioAccountProfileCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
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
    .module('cio-controllers')
    .controller('CioAccountProfileCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($rootScope, $state, CioAccountService, CioAuthService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    var _oneTwoYear        = 365*24*60*60*1000;
    var _numTwoYears       =   2 * _oneTwoYear;
    var _numHunYears       = 100 * _oneTwoYear;
    var _regexDateOfBirth  = /^((\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/;

    var _strUrlIsAvailable = '/is-available';

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.states = {
        username             : 'pristine',
        email                : 'pristine',
        password             : null,
        activeField          : null,
        verificationEmailSend: false,
    };
    vm.modelPasswords    = {};
    vm.modelUser         = null;
    vm.modelUserPristine = null;

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.readUser              = readUser;
    vm.updateUser            = updateUser;
    vm.updatePassword        = updatePassword;
    vm.deleteUser            = deleteUser;
    vm.sendVerificationEmail = sendVerificationEmail;
    vm.testDateOfBirth       = testDateOfBirth;
    vm.isAvailable           = isAvailable;

    // *************************************************************************
    // Controller function definitions
    // *************************************************************************

    /**
     * Controller function to read the user from the server.
     * 
     * @public
     */
    function readUser() {
        return CioAccountService.processUser(function(objErr, objUser) {
            vm.modelUser          = angular.copy(CioAccountService.objUser);
            vm.modelUserPristine  = angular.copy(CioAccountService.objUser);
            vm.states.activeField = null;
        });
    }

    // *************************************************************************

    /**
     * Controller function to update the user information on the server.
     *
     * @public
     */
    function updateUser() {
        return CioAccountService.processUser(vm.modelUser, function(objErr, objUser) {
            vm.modelUser          = angular.copy(CioAccountService.objUser);
            vm.modelUserPristine  = angular.copy(CioAccountService.objUser);
            vm.states.activeField = null;
        });
    }

    // *************************************************************************

    /**
     * Controller function to process user's passwords.
     *
     * @public
     */
    function updatePassword() {
        return CioAccountService.processPasswords(vm.modelPasswords, function(objErr) {
            vm.modelPasswords = {};
            if (objErr) {
                return (vm.states.password = 'incorrect');
            }
            vm.modelUser.updatedPasswordAt = new Date();
            vm.states.activeField = null;
        });
    }

    // *************************************************************************

    /**
     * Controller function to delete the user's account for good.
     * 
     * @public
     */
    function deleteUser() {
        return CioAccountService.deleteUser(vm.modelPasswords.passwordDelete, function(objErr) {
        });
    }

    // *************************************************************************

    /**
     * Controller function to send verification email.
     *
     * @public
     */
    function sendVerificationEmail() {
        return CioAccountService.sendVerificationEmail(function(objErr) {
            if (objErr) {
                return (vm.states.verificationEmailSend = 'error');
            }
            return (vm.states.verificationEmailSend = true);
        });
    }

    // *************************************************************************

    /**
     * Controller function to test the date of birth.
     *
     * @public
     */
    function testDateOfBirth() {
        if (!vm.modelUser.profile || !vm.modelUser.profile.dateOfBirth) {
            return;
        }

        var strDate = vm.modelUser.profile.dateOfBirth;
        var isValid = true;

        isValid = isValid && _regexDateOfBirth.test(strDate);
        isValid = isValid && !!(new Date(strDate)).getDate();
        isValid = isValid && Date.now() - _numTwoYears > Date.parse(strDate);
        isValid = isValid && Date.now() - _numHunYears < Date.parse(strDate);

        vm.formAccountProfile.dateOfBirth.$setValidity('invalid', isValid);
    }

    // *****************************************************************************

    /**
     * Controller function to test if "username" or "email" is available.
     * 
     * @param {String} strWhich  string of which to test
     */
    function isAvailable(strWhich) {
        var objFormField = vm.formAccountProfile[strWhich];
        var objData, objRequest;

        // set manually the validity if each field to "true"
        objFormField.$setValidity('isAvailable', true);

        // test if there are any errors in the form
        if (vm.modelUserPristine[strWhich] === vm.modelUser[strWhich]) {
            vm.formAccountProfile[strWhich].$setPristine();
            return (vm.states[strWhich] = 'pristine');
        }
        if (objFormField.$error.required) {
            return (vm.states[strWhich] = 'required');
        }
        if (objFormField.$error.minlength) {
            return (vm.states[strWhich] = 'tooShort');
        }
        if (objFormField.$error.maxlength) {
            return (vm.states[strWhich] = 'tooLong');
        }
        if (objFormField.$error.email) {
            return (vm.states[strWhich] = 'invalid');
        }

        // set the state of the field to "pending" since the request
        // is about to get fired
        vm.states[strWhich] = 'pending';
        
        objData           = {};
        objData[strWhich] = objFormField.$viewValue;

        return CioAuthService.testAvailability(strWhich, objData, function(objErr, objData) {
            if (objErr || !objData) {
                return (vm.states[strWhich] = 'error');
            }

            // set manually the validity if each field depending on result
            objFormField.$setValidity('isAvailable', !!objData.isAvailable);

            // set the state of the field depending on result
            vm.states[strWhich] = !!objData.isAvailable && 'available' || 'notAvailable';
        });
    }

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

    function _init() {
        readUser();
    } _init();

    // *************************************************************************
}

// *****************************************************************************

})();
