/**
 * @name        CioContentOverviewCtrl
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
    .controller('CioContentOverviewCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

/* @ngInject */
function Controller($window, $timeout, $document, Upload) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _urlFileCreate = '/admin/content/create';

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.modelContent = {
        title: 'Content Title',
        name : 'content-name',
        text : 'Lorem ipsum Eu dolore aliqua et laborum labore nostrud consequat proident laborum deserunt sint nisi Excepteur cillum proident id est sit cillum quis eiusmod qui sunt veniam sed adipisicing officia tempor commodo anim nisi sunt voluptate Excepteur minim non elit est ut non Excepteur deserunt ex sed ut consectetur aute laborum consectetur veniam reprehenderit commodo commodo anim ea ut sit veniam voluptate ullamco laborum laboris est magna irure incididunt deserunt adipisicing pariatur veniam id reprehenderit aliquip laboris ad deserunt anim dolor cillum in labore dolore minim nostrud laboris amet nisi laborum id anim fugiat cupidatat nisi enim aute aliqua laborum aliquip officia quis sit fugiat est ad proident ea laboris commodo voluptate magna non nostrud in exercitation sed exercitation laboris pariatur dolore velit sint enim incididunt cupidatat voluptate veniam do sunt occaecat nisi pariatur anim aliquip in qui ea do nulla consequat laboris ullamco culpa sint in esse consequat in minim elit nulla proident sunt irure laboris ut aute occaecat irure in incididunt sunt anim fugiat aliquip Duis sint est.',
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.createContent    = createContent;
    vm.removeMediaFile  = removeMediaFile;
    vm.removeImageFiles = removeImageFiles;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    /**
     * Controller function to create a content.
     *
     * @public
     */
    function createContent() {
        var objData = {
            title     : vm.modelContent.title,
            name      : vm.modelContent.name,
            text      : vm.modelContent.text,
            mediaFile : vm.modelContent.mediaFile,
            imageFiles: vm.modelContent.imageFiles,
        };

        var objUpload = {
            url : _urlFileCreate,
            data: objData,
            method: 'PUT',
            headers: { 'X-Access-Token': $window.localStorage.accessToken },
            arrayKey: '',
        };

        return Upload.upload(objUpload).then(function (resp) {
            console.log('Success! File uploaded.');
            console.log(resp);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
        // }, function (evt) {
        //     console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
        // });
    }

    // *****************************************************************************

    /**
     * Controller function to remove files from the temporary files list array.
     *
     * @public
     * @param {Object|String} mixFileToRemove  object of the file to be removed
     *                                         or string "all" to remove all
     */
    function removeImageFiles(mixFileToRemove) {
        var i;

        if (!vm.modelContent.imageFiles.length || vm.modelContent.imageFiles.length <= 0) {
            return;
        }
        if ('all' === mixFileToRemove) {
            vm.modelContent.imageFiles = [];
        }
        
        for (i = 0; i < vm.modelContent.imageFiles.length; i += 1) {
            if (vm.modelContent.imageFiles[i] === mixFileToRemove) {
                vm.modelContent.imageFiles.splice(i, 1);
                return;
            }
        }
    }

    // *****************************************************************************

    /**
     * Controller function to remove the media file.
     *
     * @public
     */
    function removeMediaFile() {
        vm.modelContent.mediaFile = null;
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

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
            value      : vm.modelContent.text,
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

    // *****************************************************************************
}

// *****************************************************************************

})();
