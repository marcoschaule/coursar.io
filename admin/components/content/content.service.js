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

    var _strUrlContentCommon = '/admin/content';
    var _strUrlContentUpload = '/admin/content/upload';

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
        objRequest.url    = _strUrlContentCommon;
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
        objRequest.id     = objRequest.id || 'read-contents';
        objRequest.url    = _strUrlContentCommon;
        objRequest.data   = objRequest.data;
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
