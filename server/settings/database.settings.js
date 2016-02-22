(function() { 'use strict';

// *****************************************************************************
// Settings object
// *****************************************************************************

var objDatabase = { redis: {}, mongoDb: {} };

// *****************************************************************************
// Redis settings
// *****************************************************************************

/**
 * Redis protocol settings.
 * @type {String}
 */
objDatabase.redis.secret = null;

/**
 * Redis protocol settings.
 * @type {String}
 */
objDatabase.redis.protocol = 'redis';

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

/**
 * Redis settings URI.
 * @type {Number}
 */
objDatabase.redis.uri = [
    objDatabase.redis.protocol + '://',
    // objDatabase.redis.secret   + '@',
    objDatabase.redis.host     + ':',
    objDatabase.redis.port     + '/',
    objDatabase.redis.name     + '/',
].join('');

// *****************************************************************************
// MongoDB settings
// *****************************************************************************

/**
 * MongoDB protocol settings.
 * @type {String}
 */
objDatabase.mongoDb.secret = null;

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
    objDatabase.mongoDb.protocol + '://',
    // objDatabase.mongoDb.secret   + '@',
    objDatabase.mongoDb.host     + ':',
    objDatabase.mongoDb.port     + '/',
    objDatabase.mongoDb.name     + '/',
].join('');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.setup = function() {
    if (!global.settings) {
        global.settings = {};
    }

    global.settings.db = objDatabase;
};

// module.exports = objDatabase;

// *****************************************************************************

})();