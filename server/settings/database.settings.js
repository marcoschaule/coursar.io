(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

var objDatabase = {};

objDatabase.protocol = 'mongodb';
objDatabase.host     = 'localhost';
objDatabase.port     = 3001;
objDatabase.name     = 'coursar-io';
objDatabase.uri      = [
    objDatabase.protocol, '://',
    objDatabase.host, ':',
    objDatabase.port, '/',
    objDatabase.name, '/',
].join('');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = objDatabase;

// *****************************************************************************

})();