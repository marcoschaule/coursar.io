/**
 * @name        CioContentBasicCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
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
    .module('cio-controllers')
    .controller('CioContentBasicCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($rootScope, $scope, $state, $sce, $window, $document,
        CioContentService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.modelContent    = {};
    vm.modelContentNew = {};
    vm.objConfigVideo  = {};
    vm.flags           = { isInit: false, isNameEncodedTitle: true, isEdit: false };
    vm.state           = { nameAvailability: 'idle' };

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.createContent          = createContent;
    vm.readContent            = readContent;
    vm.updateContent          = updateContent;
    vm.deleteContent          = deleteContent;
    vm.deleteContentMediaFile = deleteContentMediaFile;
    vm.deleteContentImageFile = deleteContentImageFile;
    vm.addMediaFile           = addMediaFile;
    vm.addMediaFilePoster     = addMediaFilePoster;
    vm.removeMediaFile        = removeMediaFile;
    vm.removeMediaFilePoster  = removeMediaFilePoster;
    vm.removeImageFiles       = removeImageFiles;
    vm.testContentName        = testContentName;
    vm.encodeName             = encodeName;

    // *************************************************************************
    // Controller function definitions
    // *************************************************************************

    /**
     * Controller function to create a content.
     *
     * @public
     */
    function createContent() {
        var objData = _buildDataObject();

        return CioContentService.createContent(objData,
                function(objErr, objResult, objPendingEvent) {

            if (objErr) {
                // do something
            }
            if (objPendingEvent) {
                return $rootScope.pending.set(objPendingEvent.loaded, objPendingEvent.total);
            }
            if (objResult.content && objResult.content._id) {
                return $state.go('contents.basicEdit', {
                    id: objResult.content._id.toString(),
                });
            }
        });
    }

    // *************************************************************************

    /**
     * Controller function to read the current content.
     *
     * @public
     * @param {Function} callback  function for callback
     */
    function readContent(callback) {
        if (!$state.params.id) {
            return;
        }

        return CioContentService.readContent($state.params.id,
                function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            if (!objResult || objResult && objResult.contents && objResult.contents.length <= 0) {
                return $state.go('contents.overview');
            }
            vm.modelContent = objResult && objResult.contents || {};
            _setupMediaFiles();
            _setupCodeMirror(vm.modelContent, callback);
        });
    }

    // *************************************************************************

    /**
     * Controller function to update the content including new uploads.
     *
     * @public
     */
    function updateContent() {
        var objData         = _buildDataObject(vm.modelContent, 'updateContentBasic');
        objData.content._id = vm.modelContent._id.toString();

        return CioContentService.updateContent(objData,
                function(objErr, objResult, objPendingEvent) {
            
            if (objErr) {
                // do something
            }
            if (objPendingEvent) {
                return $rootScope.pending.set(objPendingEvent.loaded, objPendingEvent.total);
            }
            if (objResult) {
                return $state.go($state.current, {}, { reload: true });
            }
        });
    }
    
    // *************************************************************************

    /**
     * Controller function to delete a whole content and redirect to the
     * overview page.
     *
     * @public
     */
    function deleteContent() {
        var strContentId = vm.modelContent._id;
        return CioContentService.deleteContent(strContentId, function(objErr) {
            if (objErr) {
                // do something
                return;
            }
            return $state.go('contents.overview');
        });
    }
    
    // *************************************************************************
    
    /**
     * Controller function to delete a content media file.
     *
     * @public
     */
    function deleteContentMediaFile() {
        var strContentId     = vm.modelContent._id.toString();
        var strMediaFileName = vm.modelContent.mediaFile.filename;

        return CioContentService.deleteContentMediaFile(strContentId,
                strMediaFileName, function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            vm.modelContent.mediaFile       = null;
            vm.modelContent.mediaFilePoster = null;
            return;
        });
    }
    
    // *************************************************************************
    
    /**
     * Controller function to delete content image files.
     *
     * @public
     * @param {String|Array} mixFilenames  string or array of the image file(s)
     */
    function deleteContentImageFile(mixFilenames) {
        var strContentId = vm.modelContent._id.toString();
        var arrFilenames = 'string' === typeof mixFilenames ?
                [mixFilenames] : mixFilenames;
        
        return CioContentService.deleteContentImageFile(strContentId,
                arrFilenames, function(objErr) {

            if (objErr) {
                // do something
                return;
            }
            return removeImageFiles(mixFilenames, vm.modelContent);
        });
    }

    // *************************************************************************

    /**
     * Controller function to remove files from the temporary files list array.
     *
     * @public
     * @param {String|Array} mixFilenames  array or string of the filename of
     *                                     the image to be removed
     * @param {Object}       [objModel]    (optional) object of the model to be used
     */
    function removeImageFiles(mixFilenames, objModel) {
        var arrFilenames = 'string' === typeof mixFilenames ?
                [mixFilenames] : mixFilenames;
        objModel = objModel || vm.modelContentNew;

        if ('all' === mixFilenames) {
            objModel.imageFiles = [];
        }
        for (var i = 0; i < objModel.imageFiles.length; i += 1) {
            if (arrFilenames.indexOf(objModel.imageFiles[i].filename) >= 0) {
                objModel.imageFiles.splice(i, 1);
            }
        }
    }

    // *************************************************************************

    /**
     * Controller function to add a media file to the model.
     *
     * @public
     * @param {Object} objEvent  object of the "select" event
     */
    function addMediaFile(objEvent) {
        if (!objEvent || !objEvent.target || !objEvent.target.files) {
            return;
        }
        if (!vm.modelContentNew.mediaFile) {
            vm.modelContentNew.mediaFile = {};
        }

        var _URL                         = $window.URL || $window.webkitURL;
        var objFile                      = objEvent.target.files[0];
        var objUrl                       = _URL.createObjectURL(objFile);
        vm.modelContentNew.mediaFile     = objFile;
        vm.modelContentNew.mediaFile.url = $sce.trustAsResourceUrl(objUrl);
    }

    // *************************************************************************

    /**
     * Controller function to add the media file screenshot in local memory.
     * The screenshot will be attached to the submit when creating the content.
     *
     * @public
     */
    function addMediaFilePoster() {
        if (!vm.modelContentNew || !vm.modelContentNew.mediaFile) {
            return;
        }

        // create a canvas (HTML5) element
        var elCanvas    = document.createElement('canvas');

        // get the media file element (tag)
        var elMediaFile = document.getElementById('media-file-new');

        // define size depending on the media file
        var numWidth    = elMediaFile.clientWidth;
        var numHeight   = elMediaFile.clientHeight;

        // set the canvas element's size
        elCanvas.width  = numWidth;
        elCanvas.height = numHeight;

        // get the 2D context of the canvas to manipulate it
        var context = elCanvas.getContext('2d');

        // draw the screenshot of the media file into the context
        context.drawImage(elMediaFile, 0, 0, numWidth, numHeight);

        // display the image in the view
        var objUrl = elCanvas.toDataURL('image/jpeg');
        vm.modelContentNew.mediaFilePoster    = objUrl;
        vm.modelContentNew.mediaFilePosterTmp = $sce.trustAsResourceUrl(objUrl);
    }

    // *************************************************************************

    /**
     * Controller function to remove the media file screenshot.
     *
     * @public
     */
    function removeMediaFilePoster() {
        vm.modelContentNew.mediaFile.screenshot = null;
    }

    // *************************************************************************

    /**
     * Controller function to remove the media file.
     *
     * @public
     */
    function removeMediaFile() {
        vm.modelContentNew.mediaFile = null;
    }

    // *************************************************************************

    /**
     * Controller function to test the content name for availability.
     * 
     * @public
     */
    function testContentName(objModel) {
        objModel = objModel || vm.modelContentNew;

        if (!objModel || !objModel.name) {
            return;
        }
        vm.formContent.$setValidity('contentName', true);
        vm.state.nameAvailability = 'pending';
        return CioContentService.testContentName(objModel.name,
                function(objErr, objResult) {
            vm.state.nameAvailability = objResult.state;
            vm.formContent.$setValidity('contentName', 'available' === objResult.state);
            return;
        });
    }

    // *************************************************************************

    /**
     * Controller function to transform the title into dash case if checkbox
     * is active.
     *
     * @public
     */
    function encodeName(objModel) {
        objModel = objModel || vm.modelContentNew;
        if (vm.flags.isNameEncodedTitle &&
                objModel &&
                objModel.title) {
            objModel.name = objModel.title.toDashCaseSave();
        }
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
        if ($state.params.id) {
            vm.flags.isEdit = true;
            readContent(function() {
                vm.flags.isInit = true;
            });
        }
        else {
            vm.flags.isEdit = false;
            _setupCodeMirror(vm.modelContentNew, function() {
                vm.flags.isInit = true;
            });
        }
    } _init();

    // *************************************************************************

    /**
     * Helper function to build the data object.
     *
     * @private
     * @param  {Object} [objModel]   (optional) object of the model to get the data from
     * @param  {String} [strTarget]  (optional) string of the target function
     * @return {Object}              data object for "create" or "update" process
     */
    function _buildDataObject(objModel, strTarget) {
        var fileMediaFilePoster = null;
        
        objModel  = objModel  || vm.modelContentNew;
        strTarget = strTarget || 'createContentBasic';

        if (vm.modelContentNew.mediaFilePoster) {
            fileMediaFilePoster = CioContentService.makeScreenshotFile(
                vm.modelContentNew.mediaFilePoster,
                vm.modelContentNew.mediaFile.name);
        }

        var objData = {
            target         : strTarget,
            modifiers      : null,
            imageFiles     : vm.modelContentNew.imageFiles,
            mediaFile      : vm.modelContentNew.mediaFile,
            mediaFilePoster: fileMediaFilePoster,
            content        : {
                title: objModel.title,
                name : objModel.name,
                text : objModel.text,
            },
        };
        return objData;
    }

    // *************************************************************************

    /**
     * Helper function to setup the "CodeMirror" textarea.
     *
     * @private
     * @param {Object}   objModel  object of the model to be used
     * @param {Function} callback  function for callback
     */
    function _setupCodeMirror(objModel, callback) {
        var elContentText = $document[0].getElementById('content-text');
        var strText       = objModel && objModel.text || '';
        var timeoutWait;

        var objEditor  = CodeMirror(function(elToReplace) {
            elContentText &&
            elContentText.parentNode &&
            elContentText.parentNode.replaceChild &&
            elContentText.parentNode.replaceChild(elToReplace, elContentText);
        }, {
            mode          : 'markdown',
            value         : strText,
            lineNumbers   : true,
            viewportMargin: Infinity,
        });
        objEditor.on('inputRead', function(objCodeMirror, objChange) {
            $scope.$apply(function() {
                objModel.text = objCodeMirror.getValue();
            });
        });

        return (callback && 'function' === typeof callback && callback());
    }

    // *************************************************************************

    /**
     * Helper function to setup the video file.
     *
     * @private
     */
    function _setupMediaFiles() {
        if (vm.modelContent.mediaFile && 
                vm.modelContent.mediaFile.filename) {
            var strMediaFileUrl = CioContentService.buildMediaFileUrl(
                vm.modelContent.mediaFile.filename);
            vm.modelContent.mediaFile.url = $sce.trustAsResourceUrl(strMediaFileUrl);
        }
        if (vm.modelContent.mediaFilePoster &&
                vm.modelContent.mediaFilePoster.filename) {
            var strMediaFilePosterUrl = CioContentService.buildMediaFileUrl(
                vm.modelContent.mediaFilePoster.filename, 'poster');
            vm.modelContent.mediaFilePoster.url = $sce.trustAsResourceUrl(strMediaFilePosterUrl);
        }
    }

    // *************************************************************************
    // Watchers
    // *************************************************************************

    /**
     * Watcher to watch the content name change.
     */
    $scope.$watch('vm.modelContentNew.name + vm.modelContent.name',
            function(strValueNew, strValueOld) {
        
        if (vm.flags.isEdit && strValueNew && strValueOld) {
            testContentName(vm.modelContent);
        } else {
            testContentName(vm.modelContentNew);
        }
    });

    // *************************************************************************
}

// *****************************************************************************

})();
