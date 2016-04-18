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
function Controller($rootScope, $state, $sce, $timeout, $document, CioContentService) {
    var vm = this;

    // *************************************************************************
    // Private variables
    // *************************************************************************

    // *************************************************************************
    // Public variables
    // *************************************************************************

    vm.modelContent    = null;
    vm.modelContentNew = null;
    vm.objConfigVideo  = null;

    // *************************************************************************
    // Controller function linking
    // *************************************************************************

    vm.createContent    = createContent;
    vm.removeMediaFile  = removeMediaFile;
    vm.removeImageFiles = removeImageFiles;

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
            target    : 'createContentBasic',
            modifiers : null,
            mediaFile : vm.modelContentNew.mediaFile,
            imageFiles: vm.modelContentNew.imageFiles,
            content   : {
                title: vm.modelContentNew.title,
                name : vm.modelContentNew.name,
                text : vm.modelContentNew.text,
            },
        };

        var objRequest = {
            data: objData,
        };

        return CioContentService.createContent(objRequest,
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

        var objRequest = {
            data: { contentIds: [$state.params.id] }
        };

        return CioContentService.handleContent(objRequest, function(objErr, objResult) {
            if (objErr) {
                // do something
                return;
            }
            vm.modelContent   = objResult.contents;
            vm.objConfigVideo = _setupVideo(vm.modelContent.mediaFile);
            console.log(">>> Debug ====================; vm.modelContent:", vm.modelContent, '\n\n');
        });
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
        var i;

        if (!vm.modelContentNew.imageFiles.length || vm.modelContentNew.imageFiles.length <= 0) {
            return;
        }
        if ('all' === mixFileToRemove) {
            vm.modelContentNew.imageFiles = [];
        }
        
        for (i = 0; i < vm.modelContentNew.imageFiles.length; i += 1) {
            if (vm.modelContentNew.imageFiles[i] === mixFileToRemove) {
                vm.modelContentNew.imageFiles.splice(i, 1);
                return;
            }
        }
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
    // Helper function definitions
    // *************************************************************************

    /**
     * Helper function to initialize the controller.
     *
     * @private
     */
    function _init() {
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
            mode       : 'markdown',
            value      : vm.modelContentNew && vm.modelContentNew.text || '',
            lineNumbers: true,
        });
        objEditor.on('change', _resize);

        function _resize(objCodeMirrorInstance, eventChange) {
            if (isChanging) {
                return;
            }
            clearTimeout(timeoutWait);
            
            timeoutWait = setTimeout(function() {
                isChanging = true;
                objCodeMirrorInstance.wrapParagraphsInRange(
                        eventChange.from, CodeMirror.changeEnd(eventChange), objOptions);
                isChanging = false;
            }, 200);
        }

    } _setupCodeMirror();

    // *************************************************************************

    /**
     * Helper function to setup the video file.
     *
     * @private
     */
    function _setupVideo(objMediaFile) {
        var objConfig = {
            sources: [
                { src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4'), type: 'video/mp4' },
            ],
            tracks: [{
                src: 'http://www.videogular.com/assets/subs/pale-blue-dot.vtt',
                kind: 'subtitles',
                srclang: 'en',
                label: 'English',
                default: '',
            }],
            theme: '/styles/vendor/videogular.css',
        };
        return objConfig;
    }

    // *************************************************************************
}

// *****************************************************************************

})();
