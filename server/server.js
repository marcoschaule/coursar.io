(function() { 'use strict';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

// requires
var express         = require('express');
var session         = require('express-session');
var morgan          = require('morgan');
var mongoose        = require('mongoose');
var redis           = require('redis');
var path            = require('path');
var connectRedist   = require('connect-redis');
var childProcess    = require('child_process');
var bodyParser      = require('body-parser');
var RedisSessions   = require('redis-sessions');

// setup
var env             = (process.env.NODE_ENV || 'dev');
var port            = (process.env.PORT     || 3000)*1;
var app             = express();
var RedisStore      = connectRedist(session);
var strStaticFolder = path.join(__dirname, '../build/', env);
var clientRedis;

// settings
var objSettingsDatabase = require('./settings/database.settings.js');
var objSettingsPaths    = require('./settings/paths.settings.js');

// global variables
global.paths        = objSettingsPaths;
global.appName      = 'coursarIo';
global.redisSession = new RedisSessions({ port: objSettingsDatabase.redis.port });

// *****************************************************************************
// Redis and MongoDB setup
// *****************************************************************************

// clientRedis = redis.createClient({ port: objSettingsDatabase.redis.port });
// clientRedis.on('error', (err) => {
//     console.log(err);
// });

// var objSettingsRedisSession          = {};
// objSettingsRedisSession.client       = clientRedis;
// objSettingsRedisSession.port         = objSettingsDatabase.redis.port;

// var objSettingsSession               = {};
// objSettingsSession.resave            = false;
// objSettingsSession.saveUninitialized = false;
// objSettingsSession.store             = new RedisStore(objSettingsRedisSession);
// objSettingsSession.secret            = 'too5tup!tToF!ndMy0wn5ecret';

// connect mongoose
mongoose.connect(objSettingsDatabase.mongoDb.uri);

// *****************************************************************************
// App configuration
// *****************************************************************************

app.use(express.static(strStaticFolder));
// app.use(session(objSettingsSession));
app.use(bodyParser.json());

// ********************************************************************************
// Routing
// ********************************************************************************

app.get('/', (req, res, next) => {
    res.sendFile(path.join(strStaticFolder, 'index.html'));
});

// initialize component routes
require('./components/auth/auth.routes.js')(app);

// *****************************************************************************
// Startup
// *****************************************************************************

app.listen(port, () => {
    console.log(`Node-Server running on port ${port}!`);
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

})();
