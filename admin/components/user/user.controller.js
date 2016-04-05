/**
 * @name        CioUserCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README
 */
(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var libDate = requireFromServer('server/libs/date.lib.js');

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-controllers')
    .controller('CioUserCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($filter, CioUserService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.arrUsers     = null;
    vm.modelUser    = {};
    vm.objModifiers = {
        sort: 'username'
    };
    vm.flags        = {
        isEditMode: false,
    };

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.readUsers        = readUsers;
    vm.openEditUser     = openEditUser;
    vm.closeEditUser    = closeEditUser;
    vm.setModifier      = setModifier;
    vm.setAdmin         = setAdmin;
    vm.generatePassword = generatePassword;
    vm.testDateOfBirth  = testDateOfBirth;

    // *************************************************************************
    // Controller function definitions
    // *************************************************************************

    /**
     * Controller function to read all users into table.
     *
     * @public
     */
    function readUsers() {
        return CioUserService.handleUserAction({}, 'readUsers',
                vm.objModifiers, function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            vm.arrUsers = objResult.arrUsers;
        });
    }
    
    // *************************************************************************

    /**
     * Controller function to update the current edited user.
     *
     * @public
     */
    function updateUsers() {
        var objUser = angular.copy(vm.modelUser);
        
        if (!vm.modelUser) {
            return;
        }
        if (vm.strPasswordNew) {
            objUser.passwordNew = vm.strPasswordNew;
        }

        return CioUserService.handleUserAction(objUser, 'updateUser',
                function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            vm.arrUsers = objResult.arrUsers;
        });
    }

    // *************************************************************************

    /**
     * Controller function to set or unset the user to admin.
     *
     * @public
     * @param {Object}  objUser      object of the user to be set or unset
     * @param {Boolean} isToBeAdmin  true if user is set to admin
     */
    function setAdmin(objUser, isToBeAdmin) {
        return CioUserService.handleUserAction(
                { _id: objUser._id, isToBeAdmin: isToBeAdmin },
                'setAdmin', function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            vm.arrUsers = objResult.arrUsers;
        });
    }

    // *************************************************************************

    /**
     * Controller function to open the user edit mode.
     *
     * @public
     * @param {Object} objUser  object of the user
     */
    function openEditUser(objUser) {
        vm.flags.isEditMode = true;
        vm.modelUser        = angular.copy(objUser);
        
        if (vm.modelUser.profile && vm.modelUser.profile.dateOfBirth) {
            vm.modelUser.profile.dateOfBirth = $filter('date')
                (vm.modelUser.profile.dateOfBirth, 'MM/dd/yyyy');
        }
    }

    // *************************************************************************

    /**
     * Controller function to close the user edit mode - with or without saving.
     *
     * @public
     * @param {Boolean} isSaved  true if user needs to be saved
     */
    function closeEditUser(isSaved) {
        vm.flags.isEditMode = false;
        vm.modelUser        = null;

        if (isSaved) {
        }
    }

    // *************************************************************************

    /**
     * Controller function to set the modifier for the template.
     *
     * @public
     * @param {Strign} strField  string of the field to be set
     * @param {Strign} strValue  string of the value to be set
     */
    function setModifier(strField, strValue) {
        if ('sort' === strField && !vm.objModifiers.sort) {
            vm.objModifiers = { sort: strValue };
        }
        else if ('sort' === strField && vm.objModifiers.sort.indexOf(strValue) >= 0) {
            vm.objModifiers.sort = (vm.objModifiers.sort.charAt(0) === '-' ? '' : '-') + strValue;
        } else if ('sort' === strField) {
            vm.objModifiers.sort = strValue;
        }

        return vm.readUsers();
    }

    // *************************************************************************

    /**
     * Controller function to generate a random password.
     *
     * @public
     * @return {String}  string of randomly generated password
     */
    function generatePassword() {
        return (vm.strPasswordNew = Math.random().toString(36).slice(-8));
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
        var isValid = libDate.testDateOfBirth(strDate);
        vm.formEditUser.dateOfBirth.$setValidity('invalid', isValid);
    }

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

    /**
     * Helper function to initialize the controller.
     *
     * @private
     */
    function _init() {
        readUsers();
    } _init();

    // *************************************************************************
}

// *****************************************************************************

})();
