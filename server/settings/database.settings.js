(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

var objDatabase = { redis: {}, mongoDb: {} };

// *****************************************************************************
// Redis settings
// *****************************************************************************

/**
 * Redis host settings.
 * @type {String}
 */
objDatabase.redis.host = 'localhost';

/**
 * Redis port settings.
 * @type {Number}
 */
objDatabase.redis.port = 3002;

// *****************************************************************************
// MongoDB settings
// *****************************************************************************

/**
 * MongoDB protocol settings.
 * @type {String}
 */
objDatabase.mongoDb.protocol = 'mongodb';

/**
 * MongoDB host settings.
 * @type {String}
 */
objDatabase.mongoDb.host = 'localhost';

/**
 * MongoDB port settings.
 * @type {String}
 */
objDatabase.mongoDb.port = 3001;

/**
 * MongoDB database name settings.
 * @type {String}
 */
objDatabase.mongoDb.name = 'coursar-io';

/**
 * MongoDB URI for connection.
 * @type {String}
 */
objDatabase.mongoDb.uri = [
    objDatabase.mongoDb.protocol, '://',
    objDatabase.mongoDb.host, ':',
    objDatabase.mongoDb.port, '/',
    objDatabase.mongoDb.name, '/',
].join('');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = objDatabase;

// *****************************************************************************

})();