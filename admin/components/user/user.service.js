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

    // *************************************************************************

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

    // *************************************************************************

    return service;

    // *************************************************************************
}

// *****************************************************************************

})();
