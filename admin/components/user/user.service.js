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

    service.handleUserAction = handleUserAction;
    // service.createUser       = createUser;
    // service.readUser         = readUser;
    // service.deleteUser       = deleteUser;
    // service.updateUsers      = updateUsers;
    // service.deleteUsers      = deleteUsers;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************

    /**
     * Service function to handle all default (CRUD) user actions.
     *
     * @public
     * @param {Object}   objData         object of the data to be send to the server
     * @param {String}   strTarget       string of the request strTarget, which is also used for the request id
     * @param {Object}   [objModifiers]  (optional) object of the modifications for reading the users
     * @param {Function} callback        function for callback
     */
    function handleUserAction(objData, strTarget, objModifiers, callback) {
        if (!callback && 'function' === typeof objModifiers) {
            callback = objModifiers;
        }

        var strId = strTarget.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        var objRequest = {
            id    : strId,
            url   : _urlHandleRequest,
            data  : {
                target   : strTarget,
                data     : objData,
                modifiers: objModifiers || {},
            },
        };
        return CioComService.put(objRequest, callback);
    }

    // // *************************************************************************

    // /**
    //  * Service function to create one user.
    //  *
    //  * @public
    //  * @param {Object}   objUser   object of the user to be saved in database
    //  * @param {Function} callback  function for callback
    //  */
    // function createUser(objUser, callback) {
    //     var objRequest = {
    //         id    : 'create-user',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'createUser',
    //             data     : objUser,
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }

    // // *************************************************************************
    
    // /**
    //  * Service function to read one users.
    //  *
    //  * @public
    //  * @param {String} strUserId   string of the user id of the user to be read
    //  * @param {Function} callback  function for callback
    //  */
    // function readUser(strUserId, callback) {
    //     var objRequest = {
    //         id    : 'read-user',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'readUser',
    //             data     : { _id: strUserId },
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }

    // // *************************************************************************

    // /**
    //  * Service function to read all users.
    //  *
    //  * @public
    //  * @param {String} strUserId   string of the user id of the user to be deleted
    //  * @param {Function} callback  function for callback
    //  */
    // function deleteUser(strUserId, callback) {
    //     var objRequest = {
    //         id    : 'delete-user',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'deleteUser',
    //             data     : { _id: strUserId },
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }

    // // *************************************************************************

    // /**
    //  * Service function to create multiple users for population.
    //  *
    //  * @public
    //  * @param {Array}    arrUsers  array of the users to be saven in the database
    //  * @param {Function} callback  function for callback
    //  */
    // function createUsers(arrUsers, callback) {
    //     var objRequest = {
    //         id    : 'create-user',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'createUser',
    //             data     : objUser,
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }
    
    // // *************************************************************************

    // /**
    //  * Service function to update multiple users.
    //  *
    //  * @public
    //  * @param {Array} arrUsers     array of the users to be updated
    //  * @param {Function} callback  function for callback
    //  */
    // function updateUsers(arrUsers, callback) {
    //     var objRequest = {
    //         id    : 'update-users',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'updateUsers',
    //             data     : arrUsers,
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }

    // // *************************************************************************

    // /**
    //  * Service function to delete multiple users.
    //  *
    //  * @public
    //  * @param {Array} arrUserIds   array of the user ids of the users to be deleted
    //  * @param {Function} callback  function for callback
    //  */
    // function deleteUsers(arrUserIds, callback) {
    //     var objRequest = {
    //         id    : 'delete-users',
    //         url   : _urlHandleRequest,
    //         data  : {
    //             target   : 'deleteUsers',
    //             data     : arrUserIds,
    //             modifiers: {},
    //         },
    //     };
    //     return CioComService.put(objRequest, callback);
    // }

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

    // *************************************************************************

    return service;

    // *************************************************************************
}

// *****************************************************************************

})();
