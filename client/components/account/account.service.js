/**
 * @name        CioAccountService
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
    .factory('CioAccountService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

function Service(CioComService) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _strUrlUserCreate = '/user/create';
    var _strUrlUserRead   = '/user/read';
    var _strUrlUserUpdate = '/user/update';
    var _strUrlUserDelete = '/user/delete';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.readUser = readUser;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Service method to read the user from server.
     * @public
     * 
     * @param {Function} callback  function for callback
     */
    function readUser(callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id : 'read-user',
            url: _strUrlUserRead,
        };
        return CioComService.put(objRequest, function(objErr, objUser) {
            if (objErr) {
                return callback(objErr);
            }
            return callback(null, objUser);
        });
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['CioComService'];

// *****************************************************************************

})();
