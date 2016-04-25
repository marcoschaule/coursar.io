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

    var _strTokenIdentifier            = 'accessToken';
    var _strUrlReadMediaFile           = '/admin/content/read-media-file/';
    var _strUrlReadMediaFilePoster     = '/admin/content/read-media-file-poster/';
    var _strUrlReadMediaFileImages     = '/admin/content/read-images/';
    var _strUrlContentCreate           = '/admin/content/create';
    var _strUrlContentRead             = '/admin/content/read';
    var _strUrlContentUpdate           = '/admin/content/update';
    var _strUrlContentDelete           = '/admin/content/delete';
    var _strUrlContentDeleteMediaFile  = '/admin/content/delete-media-file';
    var _strUrlContentDeleteImageFiles = '/admin/content/delete-image-files';
    var _strUrlTestContentName         = '/admin/content/test-name';

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
    service.makeScreenshotFile     = makeScreenshotFile;

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
     * @param {String}   strMediaFilename  string of the media filename
     * @param {Function} callback          function for callback
     */
    function deleteContentMediaFile(strMediaFilename, callback) {
        var objRequest = {
            id  : 'delete-content-media-file',
            url : _strUrlContentDeleteMediaFile,
            data: { mediaFile: strMediaFilename },
        };
        return CioComService.put(objRequest, callback);
    }
    
    // *************************************************************************
    
    /**
     * Service function to delete one image file from a content.
     *
     * @public
     * @param {String}   strContentId  string of the content id
     * @param {Array}    arrFilenames  array of the image filenames
     * @param {Function} callback      function for callback
     */
    function deleteContentImageFile(strContentId, arrFilenames, callback) {
        var objRequest = {
            id  : 'delete-content-image-file',
            url : _strUrlContentDeleteImageFiles,
            data: { _id: strContentId, filenames: arrFilenames },
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
    function buildMediaFileUrl(strFilename, strWhich) {
        var strToken   = CioComService.getToken('accessToken');
        var strUrlPart = 
            'poster' === strWhich && _strUrlReadMediaFilePoster ||
            'image'  === strWhich && _strUrlReadMediaFileImages ||
            _strUrlReadMediaFile;
        
        var strUrl = [
            strUrlPart,
            strFilename + '?',
            _strTokenIdentifier + '=',
            strToken,
        ].join('');

        return strUrl;
    }

    // *************************************************************************

    /**
     * Service function to make a screenshot file from data URL and filename.
     *
     * @public
     * @param  {Object} objDataUrl   object of the data URL
     * @param  {String} strFilename  string of the filename of the media file source
     * @return {File}                file of the created image
     */
    function makeScreenshotFile(objDataUrl, strFilename) {
        var strBytes, strMimetype, arrBytes, strFileEnding, blob, file, i;

        // convert base64/URLEncoded data component to raw binary data held in a string
        if (objDataUrl.split(',')[0].indexOf('base64') >= 0) {
            strBytes = atob(objDataUrl.split(',')[1]);
        } else {
            strBytes = unescape(objDataUrl.split(',')[1]);
        }

        // separate out the mime component
        strMimetype = objDataUrl.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        arrBytes = new Uint8Array(strBytes.length);
        for (i = 0; i < strBytes.length; i++) {
            arrBytes[i] = strBytes.charCodeAt(i);
        }
        
        // define the filename ending
        strFileEnding = strMimetype.replace('image/', '');
        
        // define the whole filename
        strFilename = strFilename.replace(/\.([\d\w]{2,4})$/, ' - Screenshot.' + strFileEnding);

        // create the blob from the bytes and with the mime type
        blob = new Blob([arrBytes], { type: strMimetype });

        // create the file from the blob
        file = new File([blob], strFilename, { type: strMimetype });
        console.log(">>> Debug ====================; file:", file, '\n\n');
        return file; 
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
