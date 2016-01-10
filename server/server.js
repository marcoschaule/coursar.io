(function() { 'use strict';

// ********************************************************************************
// Requires and setup
// ********************************************************************************

// requires
var express         = require('express');
var session         = require('express-session');
var morgan          = require('morgan');
var redis           = require('redis');
var path            = require('path');
var connectRedist   = require('connect-redis');
var childProcess    = require('child_process');
var bodyParser      = require('body-parser');

// setup
var env             = process.env.NODE_ENV || 'dev';
var port            = process.env.PORT     || 3000;
var expressServer   = express();
var RedisStore      = connectRedist(session);
var strStaticFolder = path.join(__dirname, '../build/', env);
var redisClient, redisServer;

// *****************************************************************************
// Redis
// *****************************************************************************

if ('dev' === env) {
    _startupRedisServer();
}
if (true) {
    _startupRedisClient();
}

// *****************************************************************************
// Settings
// *****************************************************************************

var objSettingsRedisSession          = {};
objSettingsRedisSession.client       = redisClient;

var objSettingsSession               = {};
objSettingsSession.resave            = false;
objSettingsSession.saveUninitialized = false;
objSettingsSession.store             = new RedisStore(objSettingsRedisSession);
objSettingsSession.secret            = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Config
// *****************************************************************************

expressServer.use(express.static(strStaticFolder));
expressServer.use(session(objSettingsSession));
expressServer.use(bodyParser.json());

// ********************************************************************************
// Routing
// ********************************************************************************

expressServer.get('/', (req, res, next) => {
    res.sendFile(path.join(strStaticFolder, 'index.html'));
});

// *****************************************************************************
// Express
// *****************************************************************************

_startupExpressServer();

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to startup the express server.
 */
function _startupExpressServer() {
    expressServer.listen(port, () => {
        console.log(`Node-Server running on port ${port}!`);
    });
}

// *****************************************************************************

/**
 * Helper function to startup the redis server.
 */
function _startupRedisServer() {
    redisServer = childProcess.spawn('redis-server');

    redisServer.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
}

// *****************************************************************************

/**
 * Helper function to startup the redis client.
 */
function _startupRedisClient() {
    redisClient = redis.createClient();

    redisClient.on('error', (err) => {
        console.log(err);
    });
}

// ********************************************************************************

})();
