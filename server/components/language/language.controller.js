(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var fs   = require('fs');
var path = require('path');

var strPathLanguages = './languages';

// *****************************************************************************
// Controller functions
// *****************************************************************************

function getLanguage(req, res, next) {
    var strPathFile;

    if (!req.params.strLanguageKey) {
        return res.status(400).json({ err: 'No language found!' });
    }

    // strPathFile = path.join(strPathLanguages);

    return fs.readdir();
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.getLanguage = getLanguage;

// *****************************************************************************

})();