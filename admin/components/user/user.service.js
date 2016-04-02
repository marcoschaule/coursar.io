/**
 * @name        CioUserService
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
    .factory('CioUserService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service(CioComService) {
    var service = {};

    // *************************************************************************
    // Private variables
    // *************************************************************************

    var _urlHandleRequest = '/user-admin';

    // *************************************************************************
    // Public variables
    // *************************************************************************

    // *************************************************************************
    // Service function linking
    // *************************************************************************

    service.createUser  = createUser;
    service.readUser    = readUser;
    service.updateUser  = updateUser;
    service.deleteUser  = deleteUser;
    service.readUsers   = readUsers;
    service.updateUsers = updateUsers;
    service.deleteUsers = deleteUsers;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************

    /**
     * Service function to read all users.
     *
     * @public
     * @param {String} strUserId   string of the user id of the user to be read
     * @param {Function} callback  function for callback
     */
    function createUser(objUser, callback) {
        var objRequest = {
            id    : 'create-user',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : objUser,
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************
    
    /**
     * Service function to read all users.
     *
     * @public
     * @param {String} strUserId   string of the user id of the user to be read
     * @param {Function} callback  function for callback
     */
    function readUser(strUserId, callback) {
        var objRequest = {
            id    : 'read-user',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : { _id: strUserId },
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to read all users.
     *
     * @public
     * @param {Object} objUser     object of the user to be updated
     * @param {Function} callback  function for callback
     */
    function updateUser(objUser, callback) {
        var objRequest = {
            id    : 'update-user',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : objUser,
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to read all users.
     *
     * @public
     * @param {String} strUserId   string of the user id of the user to be deleted
     * @param {Function} callback  function for callback
     */
    function deleteUser(strUserId, callback) {
        var objRequest = {
            id    : 'delete-user',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : { _id: strUserId },
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }
    
    // *************************************************************************

    /**
     * Service function to read all users.
     *
     * @public
     * @param {Function} callback  function for callback
     */
    function readUsers(callback) {
        var objRequest = {
            id    : 'read-users',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : null,
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }
    
    // *************************************************************************

    /**
     * Service function to update multiple users.
     *
     * @public
     * @param {Array} arrUsers     array of the users to be updated
     * @param {Function} callback  function for callback
     */
    function updateUsers(arrUsers, callback) {
        var objRequest = {
            id    : 'update-users',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : arrUsers,
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to delete multiple users.
     *
     * @public
     * @param {Array} arrUserIds   array of the user ids of the users to be deleted
     * @param {Function} callback  function for callback
     */
    function deleteUsers(arrUserIds, callback) {
        var objRequest = {
            id    : 'delete-users',
            url   : _urlHandleRequest,
            data  : {
                target   : 'readUsers',
                data     : arrUserIds,
                modifiers: {},
            },
        };
        return CioComService.put(objRequest, callback);
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
