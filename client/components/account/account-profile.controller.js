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
function Controller($rootScope, $state, CioAccountService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    var _oneTwoYear       = 365*24*60*60*1000;
    var _numTwoYears      =   2 * _oneTwoYear;
    var _numHunYears      = 100 * _oneTwoYear;
    var _regexDateOfBirth = /^((\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/;

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.states = {
        activeField: null,
    };
    vm.modelUser = null;

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.readUser              = readUser;
    vm.updateUser            = updateUser;
    vm.sendVerificationEmail = sendVerificationEmail;
    vm.testDateOfBirth       = testDateOfBirth;

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
            vm.modelUser = CioAccountService.objUser;
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
            vm.modelUser = CioAccountService.objUser;
            vm.states.activeField = null;
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
