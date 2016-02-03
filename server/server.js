(function() { 'use strict';

// ********************************************************************************
// Requires and setup
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
var RedisSession    = require('redis-session');

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
global.paths   = objSettingsPaths;
global.appName = 'coursarIo';

// *****************************************************************************
// Settings
// *****************************************************************************

// var objSettingsRedisSession          = {};
// objSettingsRedisSession.client       = clientRedis;

// var objSettingsSession               = {};
// objSettingsSession.resave            = false;
// objSettingsSession.saveUninitialized = false;
// objSettingsSession.store             = new RedisStore(objSettingsRedisSession);
// objSettingsSession.secret            = 'too5tup!tToF!ndMy0wn5ecret';

// *****************************************************************************
// Connections
// *****************************************************************************

// connect redis sessions
var connectionRedisSession = new RedisSession({
    host: objSettingsDatabase.redis.host,
    port: objSettingsDatabase.redis.port,
});

// connect mongoose
mongoose.connect(objSettingsDatabase.mongoDb.uri);

// *****************************************************************************
// Config
// *****************************************************************************

app.use(express.static(strStaticFolder));
// app.use(session(objSettingsSession));
app.use(bodyParser.json());

connectionRedisSession.create({
    app: global.appName,
    id: 'myId',
    ip: '127.0.0.1',
    ttl: 3600,
    d: { 
        foo: "bar",
        unread_msgs: 34
    }
}, (objErr, objRes) => {
    console.log(">>> Debug ====================; objRes:", objRes, '\n\n');
    // resp should be something like 
    // {token: "r30kKwv3sA6ExrJ9OmLSm4Wo3nt9MQA1yG94wn6ByFbNrVWhcwAyOM7Zhfxqh8fe"}
});

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

// clientRedis = redis.createClient({ port: port+2 });
// clientRedis.on('error', (err) => {
//     console.log(err);
// });

// *****************************************************************************
// Helper functions
// *****************************************************************************

})();
