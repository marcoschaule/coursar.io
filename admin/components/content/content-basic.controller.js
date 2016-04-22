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
    vm.flags           = { isNameEncodedTitle: true };
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
        var objData = {
            target         : 'createContentBasic',
            modifiers      : null,
            mediaFile      : vm.modelContentNew.mediaFile,
            mediaFilePoster: vm.modelContentNew.mediaFilePoster,
            imageFiles     : vm.modelContentNew.imageFiles,
            content        : {
                title: vm.modelContentNew.title,
                name : vm.modelContentNew.name,
                text : vm.modelContentNew.text,
            },
        };

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
                    id     : objResult.content._id.toString(),
                    content: objResult.content,
                });
            }
        });
    }

    // *************************************************************************

    /**
     * Controller function to read the current content.
     *
     * @public
     */
    function readContent() {
        if ($state.params.content) {
            return (vm.modelContentNew = $state.params.content);
        }
        if (!$state.params.id) {
            return;
        }

        return CioContentService.readContent($state.params.id, function(objErr, objResult) {
            if (objErr) {
                // do something
                return;
            }
            vm.modelContent = objResult.contents;
            if (vm.modelContent && vm.modelContent.mediaFile) {
                vm.objConfigVideo = _setupMediaFile(vm.modelContent.mediaFile);
            }
        });
    }

    // *************************************************************************

    function updateContent() {}
    
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
        var strMediaFileName = vm.modelContent.mediaFile.filename;

        if (!strMediaFileName) {
            return;
        }

        return CioContentService.deleteContentMediaFile(
                strMediaFileName, function(objErr, objResult) {
            
            if (objErr) {
                // do something
                return;
            }
            return (vm.modelContent.mediaFile = null);
        });
    }
    
    // *************************************************************************
    
    function deleteContentImageFile(strImageFile) {
    }

    // *************************************************************************

    /**
     * Controller function to remove files from the temporary files list array.
     *
     * @public
     * @param {Object|String} mixFileToRemove  object of the file to be removed
     *                                         or string "all" to remove all
     */
    function removeImageFiles(mixFileToRemove) {
        if (!vm.modelContentNew.imageFiles.length || vm.modelContentNew.imageFiles.length <= 0) {
            return;
        }
        if ('all' === mixFileToRemove) {
            vm.modelContentNew.imageFiles = [];
        }
        for (var i = 0; i < vm.modelContentNew.imageFiles.length; i += 1) {
            if (vm.modelContentNew.imageFiles[i] === mixFileToRemove) {
                vm.modelContentNew.imageFiles.splice(i, 1);
                return;
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
        var objUrl = elCanvas.toDataURL();
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
    function testContentName() {
        if (!vm.modelContentNew || !vm.modelContentNew.name) {
            return;
        }
        vm.formContent.$setValidity('contentName', true);
        vm.state.nameAvailability = 'pending';
        return CioContentService.testContentName(vm.modelContentNew.name,
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
    function encodeName() {
        if (vm.flags.isNameEncodedTitle &&
                vm.modelContentNew &&
                vm.modelContentNew.title) {
            vm.modelContentNew.name = vm.modelContentNew.title.toDashCaseSave();
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
        _setupCodeMirror();
        if ($state.params.id) {
            readContent();
        }
    } _init();

    // *************************************************************************

    /**
     * Helper function to setup the "CodeMirror" textarea.
     *
     * @private
     */
    function _setupCodeMirror() {
        var elContentText = $document[0].getElementById('content-text');
        var isChanging    = false;
        var objOptions    = { };
        var timeoutWait;

        var objEditor  = CodeMirror(function(elToReplace) {
            elContentText.parentNode.replaceChild(elToReplace, elContentText);
        }, {
            mode          : 'markdown',
            value         : vm.modelContentNew && vm.modelContentNew.text || '',
            lineNumbers   : true,
            viewportMargin: Infinity,
        });
    }

    // *************************************************************************

    /**
     * Helper function to setup the video file.
     *
     * @private
     */
    function _setupMediaFile() {
        var strUrl = CioContentService.buildMediaFileUrl(
            vm.modelContent.mediaFile.filename);
        vm.modelContent.mediaFile.url = $sce.trustAsResourceUrl(strUrl);
    }

    // *************************************************************************
    // Watchers
    // *************************************************************************

    /**
     * Watcher to watch the content name change.
     */
    $scope.$watch('vm.modelContentNew.name', function(strValueNew) {
        testContentName();
    });

    // *************************************************************************
}

// *****************************************************************************

})();
