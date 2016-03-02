(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

if (!global.settings) {
    global.settings = {};
}
settings.database = { redis: {}, mongoDb: {} };
settings.db       = settings.database;

// *****************************************************************************
// Redis settings
// *****************************************************************************

/**
 * Redis protocol settings.
 * @type {String}
 */
settings.database.redis.secret = null;

/**
 * Redis protocol settings.
 * @type {String}
 */
settings.database.redis.protocol = 'redis';

/**
 * Redis host settings.
 * @type {String}
 */
settings.database.redis.host = 'localhost';

/**
 * Redis port settings.
 * @type {Number}
 */
settings.database.redis.port = 3002;

/**
 * Redis settings URI.
 * @type {Number}
 */
settings.database.redis.uri = [
    settings.database.redis.protocol + '://',
    // settings.database.redis.secret   + '@',
    settings.database.redis.host     + ':',
    settings.database.redis.port     + '/',
    settings.database.redis.name     + '/',
].join('');

// *****************************************************************************
// MongoDB settings
// *****************************************************************************

/**
 * MongoDB protocol settings.
 * @type {String}
 */
settings.database.mongoDb.secret = null;

/**
 * MongoDB protocol settings.
 * @type {String}
 */
settings.database.mongoDb.protocol = 'mongodb';

/**
 * MongoDB host settings.
 * @type {String}
 */
settings.database.mongoDb.host = 'localhost';

/**
 * MongoDB port settings.
 * @type {String}
 */
settings.database.mongoDb.port = 3001;

/**
 * MongoDB database name settings.
 * @type {String}
 */
settings.database.mongoDb.name = 'coursar-io';

/**
 * MongoDB URI for connection.
 * @type {String}
 */
settings.database.mongoDb.uri = [
    settings.database.mongoDb.protocol + '://',
    // settings.database.mongoDb.secret   + '@',
    settings.database.mongoDb.host     + ':',
    settings.database.mongoDb.port     + '/',
    settings.database.mongoDb.name     + '/',
].join('');

// *****************************************************************************
// Exports
// *****************************************************************************

// *****************************************************************************

})();