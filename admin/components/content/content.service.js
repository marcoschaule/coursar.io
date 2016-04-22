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

    var _strTokenIdentifier           = 'accessToken';
    var _strUrlReadMediaFile          = '/admin/content/read-media-file/';
    var _strUrlContentCreate          = '/admin/content/create';
    var _strUrlContentRead            = '/admin/content/read';
    var _strUrlContentUpdate          = '/admin/content/update';
    var _strUrlContentDelete          = '/admin/content/delete';
    var _strUrlContentDeleteMediaFile = '/admin/content/delete-media-file';
    var _strUrlContentDeleteImageFile = '/admin/content/delete-image-file';
    var _strUrlTestContentName        = '/admin/content/test-name';

    // *************************************************************************
    // Public variables
    // *************************************************************************

    // *************************************************************************
    // Service function linking
    // *************************************************************************

    service.createContent          = createContent;
    service.readContent            = readContent;
    service.readAllContents        = readAllContents;
    service.deleteContent          = deleteContent;
    service.deleteContentMediaFile = deleteContentMediaFile;
    service.deleteContentImageFile = deleteContentImageFile;
    service.testContentName        = testContentName;
    service.buildMediaFileUrl      = buildMediaFileUrl;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************

    /**
     * Service function to create a content.
     *
     * @public
     * @param {Object}   objData   object of the data the content will be created with
     * @param {Function} callback  function for callback
     */
    function createContent(objData, callback) {
        var objRequest = {
            method : 'PUT',
            id     : 'create-content',
            url    : _strUrlContentCreate,
            data   : objData,
        };
        return CioComService.upload(objRequest, callback);
    }

    // *************************************************************************
    
    /**
     * Service function to read one content by id.
     *
     * @param {String}   strContentId  string of the content id
     * @param {Function} callback      function for callback
     * @public
     */
    function readContent(strContentId, callback) {
        var objRequest = {
            id  : 'read-contents',
            url : _strUrlContentRead,
            data: { contentIds: [strContentId] }
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to read all contents.
     *
     * @public
     */
    function readAllContents(callback) {
        var objRequest = {
            id  : 'read-contents',
            url : _strUrlContentRead,
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to delete a content.
     *
     * @public
     * @param {String}   strContentId  string of the content id
     * @param {Function} callback      function for callback
     */
    function deleteContent(strContentId, callback) {
        var objRequest = {
            id  : 'delete-content',
            url : _strUrlContentDelete,
            data: { arrContentIds: [strContentId] },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************
    
    /**
     * Service function to delete one media file from a content.
     *
     * @public
     * @param {String}   strContentId      string of the content id
     * @param {String}   strMediaFilename  string of the media filename
     * @param {Function} callback          function for callback
     */
    function deleteContentMediaFile(strContentId, strMediaFilename, callback) {
        var objRequest = {
            id  : 'delete-content-media-file',
            url : _strUrlContentDeleteMediaFile,
            data: { _id: strContentId, mediaFile: strMediaFilename },
        };
        return CioComService.put(objRequest, callback);
    }
    
    // *************************************************************************
    
    /**
     * Service function to delete one image file from a content.
     *
     * @public
     * @param {String}   strContentId      string of the content id
     * @param {String}   strImageFilename  string of the image filename
     * @param {Function} callback          function for callback
     */
    function deleteContentImageFile(strContentId, strImageFilename, callback) {
        var objRequest = {
            id  : 'delete-content-image-file',
            url : _strUrlContentDeleteMediaFile,
            data: { _id: strContentId, imageFile: strImageFilename },
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to test if a given content name is available or not.
     *
     * @public
     * @param {String}   strContentName  string of the content name
     * @param {Function} callback        function for callback
     */
    function testContentName(strContentName, callback) {
        var objRequest = {
            id       : 'test-content-name',
            url      : _strUrlTestContentName,
            data     : { name: strContentName },
            isTimeout: true,
        };
        return CioComService.put(objRequest, callback);
    }

    // *************************************************************************

    /**
     * Service function to build the media file URL for retrieving the media file.
     *
     * @public
     * @param  {String} _strFilename  string of the file name to build the URL from
     * @return {String}               string of the URL build from the filename
     */
    function buildMediaFileUrl(_strFilename) {
        var _strToken = CioComService.getToken('accessToken');
        var strUrl    = [
            _strUrlReadMediaFile,
            _strFilename + '?',
            _strTokenIdentifier + '=',
            _strToken,
        ].join('');

        return strUrl;
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
