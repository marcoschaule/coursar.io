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
var env             = (process.env.NODE_ENV || 'dev');
var port            = (process.env.PORT     || 3000)*1;
var app             = express();
var RedisStore      = connectRedist(session);
var strStaticFolder = path.join(__dirname, '../build/', env);
var clientRedis;

// *****************************************************************************
// Settings
// *****************************************************************************

var objSettingsRedisSession          = {};
objSettingsRedisSession.client       = clientRedis;

var objSettingsSession               = {};
objSettingsSession.resave            = false;
objSettingsSession.saveUninitialized = false;
objSettingsSession.store             = new RedisStore(objSettingsRedisSession);
objSettingsSession.secret            = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Config
// *****************************************************************************

app.use(express.static(strStaticFolder));
app.use(session(objSettingsSession));
app.use(bodyParser.json());

// ********************************************************************************
// Routing
// ********************************************************************************

app.get('/', (req, res, next) => {
    res.sendFile(path.join(strStaticFolder, 'index.html'));
});

// *****************************************************************************
// Startup
// *****************************************************************************

app.listen(port, () => {
    console.log(`Node-Server running on port ${port}!`);
});

// *****************************************************************************

clientRedis = redis.createClient({ port: port+2 });
clientRedis.on('error', (err) => {
    console.log(err);
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

})();
