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
function Controller($document, Upload) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.createContent      = createContent;
    vm.removeFileFromList = removeFileFromList;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function createContent() {
        var objData = {
            title     : vm.modelContent.title,
            name      : vm.modelContent.name,
            text      : vm.modelContent.text,
            imageFiles: vm.modelContent.imageFiles,
        };

        var objUpload = {
            url : 'upload/url',
            data: objData,
        };

        return Upload.upload(objUpload).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
        });
    }

    // *****************************************************************************

    /**
     * Controller function to remove files from the temporary files list array.
     *
     * @public
     * @param {Object|String} mixFileToRemove  object of the file to be removed
     *                                         or string "all" to remove all
     */
    function removeFileFromList(mixFileToRemove) {
        var i, indexToRemove;

        if (!vm.modelContent.imageFiles.length || vm.modelContent.imageFiles.length <= 0) {
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
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to setup the "CodeMirror" textarea.
     *
     * @private
     */
    function _setupCodeMirror() {
        var elContentText = $document[0].getElementById('content-text');
        var myCodeMirror  = CodeMirror(function(elToReplace) {
            elContentText.parentNode.replaceChild(elToReplace, elContentText);
        }, {
            mode       : 'markdown',
            lineNumbers: true,
        });

    } _setupCodeMirror();

    // *****************************************************************************
}

// *****************************************************************************

})();
