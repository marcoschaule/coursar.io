/**
 * @name        CioContentService
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
    .factory('CioContentService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service(CioComService) {
    var service = {};

    // *************************************************************************
    // Private variables
    // *************************************************************************

    var _strUrlContentCreate = '/admin/content/create';
    var _strUrlContentRead   = '/admin/content/read';
    var _strUrlContentUpdate = '/admin/content/update';
    var _strUrlContentDelete = '/admin/content/delete';

    // *************************************************************************
    // Public variables
    // *************************************************************************

    // *************************************************************************
    // Service function linking
    // *************************************************************************

    service.createContent = createContent;
    service.handleContent = handleContent;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************
    
    /**
     * Service function to create one content.
     * 
     * @public
     * @param {Object}   objRequest  object to perform the request
     * @param {Function} callback    function for callback
     */
    function createContent(objRequest, callback) {
        objRequest.method = 'PUT';
        objRequest.id     = 'create-content';
        objRequest.url    = _strUrlContentCreate;
        objRequest.data   = objRequest.data;
        return CioComService.upload(objRequest, callback);
    }

    // *************************************************************************
    
    /**
     * Service function to read, update or delete one content,
     * or read multiple contents.
     * 
     * @public
     * @param {Object}   objRequest  object to perform the request
     * @param {Function} callback    function for callback
     */
    function handleContent(objRequest, callback) {
        if (!callback && 'function' === typeof objRequest) {
            callback   = objRequest;
            objRequest = {};
        }

        objRequest.id     = objRequest.id   || 'read-contents';
        objRequest.url    = objRequest.url  || _strUrlContentRead;
        objRequest.data   = objRequest.data || {};
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
