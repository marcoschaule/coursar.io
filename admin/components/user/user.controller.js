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
function Controller($filter, $state, CioAuthService, CioUserService, CioUserPopulationService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.formEditUser      = {};
    vm.arrUsers          = null;
    vm.modelUser         = null;
    vm.modelUserPristine = null;
    vm.objModifiers      = { sort      : 'username' };
    vm.flags             = { isEditMode: false };
    vm.states            = {
        username             : 'pristine',
        email                : 'pristine',
        password             : null,
        activeField          : null,
        verificationEmailSend: false,
    };

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.createUser         = createUser;
    vm.readUsers          = readUsers;
    vm.updateUser         = updateUser;
    vm.deleteUser         = deleteUser;
    vm.setAdmin           = setAdmin;
    vm.setModifier        = setModifier;
    vm.openEditUser       = openEditUser;
    vm.closeEditUser      = closeEditUser;
    vm.generatePassword   = generatePassword;
    vm.generateRandomUser = generateRandomUser;
    vm.generatePopulation = generatePopulation;
    vm.testDateOfBirth    = testDateOfBirth;
    vm.testAvailability   = testAvailability;

    // *************************************************************************
    // Controller function definitions
    // *************************************************************************

    /**
     * Controller function to create a new user.
     *
     * @public
     * @param {Boolean} isReturn  true if the to return to users list after saving
     */
    function createUser(isReturn) {
        if (!vm.modelUser) {
            return;
        }
        return CioUserService.handleUserAction(vm.modelUser, 'createUser',
                function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            return isReturn && $state.go('users');
        });
    }

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
    function updateUser(isReturn) {
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

            _rematchUser(objResult.objUser);
            return isReturn && closeEditUser();
        });
    }

    // *************************************************************************

    /**
     * Controller function to delete a user and remove it from users array.
     *
     * @public
     * @param {Object} objUser  object of the user to be removed
     */
    function deleteUser(objUser) {
        return CioUserService.handleUserAction(objUser._id.toString(),
                'deleteUser', function(objErr) {
            
            if (objErr) {
                // do something
                return;
            }
            // return _rematchUser(objUser, true);
            return readUsers();
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
     * Controller function to open the user edit mode.
     *
     * @public
     * @param {Object} objUser  object of the user
     */
    function openEditUser(objUser) {
        vm.strPasswordNew    = '';
        vm.flags.isEditMode  = true;
        vm.modelUser         = angular.copy(objUser);
        vm.modelUserPristine = angular.copy(objUser);
        
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
     */
    function closeEditUser() {
        vm.strPasswordNew   = '';
        vm.flags.isEditMode = false;
        vm.modelUser        = null;
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
     * Controller function to generate a random user to populate the Database.
     *
     * @public
     */
    function generateRandomUser() {
        vm.modelUser      = CioUserPopulationService.generateRandomUser();
        vm.strPasswordNew = vm.modelUser.passwordNew;
    }

    // *************************************************************************

    /**
     * Controller function to generate multiple random users for population.
     *
     * @public
     */
    function generatePopulation() {
        var arrUsers = CioUserPopulationService.
            generatePopulation(vm.numUsersForPopulation);

        return CioUserService.handleUserAction(
                arrUsers, 'createUsers',
                function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            return vm.arrUsers.push.apply(vm.arrUsers, objResult.arrUsers);
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
        var isValid = libDate.testDateOfBirth(strDate);
        vm.formEditUser.dateOfBirth.$setValidity('invalid', isValid);
    }

    // *****************************************************************************

    /**
     * Controller function to test if "username" or "email" is available.
     * 
     * @param {String} strWhich  string of which to test
     */
    function testAvailability(strWhich) {
        var objFormField = vm.formEditUser[strWhich];
        var objData, objRequest;

        if (!vm.modelUserPristine) {
            vm.modelUserPristine = angular.copy(vm.modelUser);
        }

        // set manually the validity if each field to "true"
        objFormField.$setValidity('isAvailable', true);

        // test if there are any errors in the form
        if (vm.modelUserPristine[strWhich] === vm.modelUser[strWhich]) {
            vm.formEditUser[strWhich].$setPristine();
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
            if (objFormField.$invalid) {
                return;
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

    /**
     * Helper function to initialize the controller.
     *
     * @private
     */
    function _init() {
        readUsers();
    } _init();

    // *************************************************************************

    /**
     * Helper function to update the user array.
     *
     * @public
     * @param {Object}  objUser    object of user that is used to update the user array
     * @param {Boolean} isRemoved  true if the user is to be removed
     */
    function _rematchUser(objUser, isRemoved) {
        objUser = objUser || vm.modelUser;
        for (var i = 0; i < vm.arrUsers.length; i += 1) {
            if (vm.arrUsers[i]._id === objUser._id && !isRemoved) {
                return (vm.arrUsers[i] = angular.copy(objUser));
            }
            else if (vm.arrUsers[i]._id === objUser._id && isRemoved) {
                return (delete vm.arrUsers[i]);
            }
        }
    }

    // *************************************************************************
}

// *****************************************************************************

})();
