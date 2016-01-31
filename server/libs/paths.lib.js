(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs            = require('fs');
var path          = require('path');
var async         = require('async');

var strPathServer = path.join(process.cwd(), 'server');
var objPaths      = {};

// *****************************************************************************
// Library functions
// *****************************************************************************

function buildPaths() {
    console.log(">>> Debug ====================; strPathServer:", strPathServer, '\n\n');
    _readPath(strPathServer);
}

// *****************************************************************************
// Helpers
// *****************************************************************************

function _readFiles(arrFilesOrFolders, callback) {
    var filePath = '';

    return asyncSeries(arrFiles, (strFileOrFolder, _callback) => {
        filePath = path.join();

        if (fs.stat().isFile(strFileOrFolder)) {

        }

    }, (objErr) => {

    });
}

// *****************************************************************************

function _readPath(strPath, callback) {
    callback = 'function' === typeof callback && callback || function(){};

    return fs.readdir(strPath, (objErr, arrFilesOrFolders) => {
        if (objErr) {
            return callback(objErr);
        }
        return callback(null, arrFilesOrFolders);
    });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = buildPaths();

// *****************************************************************************

})();