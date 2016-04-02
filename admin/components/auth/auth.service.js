/**
 * @name        CioAuthService
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
    .factory('CioAuthService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service(CioComService) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _strUrlSignIn = '/admin/sign-in';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    service.isSignedIn = false;

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.signIn = signIn;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Service function to sign in the admin.
     *
     * @public
     * @param {Object}   objData   object of the data to sign in
     * @param {Function} callback  function for callback
     */
    function signIn(objData, callback) {
        callback = 'function' === typeof callback && callback || function(){};

        var objRequest = {
            id   : 'sign-in',
            url  : _strUrlSignIn,
            data : objData,
        };

        CioComService.deleteToken('accessToken');
        return CioComService.put(objRequest, function(objErr, objData) {
            if (objErr) {
                return callback(objErr);
            }
            service.isSignedIn = true;
            return ('function' === typeof callback && callback(null, objData));
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

})();
