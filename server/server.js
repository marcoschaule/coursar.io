(function() { 'use strict';

// *****************************************************************************
// Constants
// *****************************************************************************

const APPNAME = 'coursar.io';
const APPURL  = 'coursar.io';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

// requires
var express             = require('express');
var redis               = require('redis');
var mongoose            = require('mongoose');
var morgan              = require('morgan');
var path                = require('path');
var childProcess        = require('child_process');
var bodyParser          = require('body-parser');
var JWTRedisSession     = require('jwt-redis-session');
// var session          = require('express-session');
// var connectRedist    = require('connect-redis');
// var RedisSessions    = require('redis-sessions');

// setup
var env                 = (process.env.NODE_ENV || 'dev');
var port                = (process.env.PORT     || 3000)*1;
var app                 = express();
// var RedisStore       = connectRedist(session);
var strStaticFolder     = path.join(__dirname, '../.build/', env);
var objRedisClient, objRedisSettings;

// setup settings
require('./settings/database.settings.js').setup();
require('./settings/auth.settings.js').setup();
require('./settings/paths.settings.js').setup();

// *****************************************************************************
// Redis and MongoDB setup
// *****************************************************************************

// create redis client based on settings
objRedisClient = redis.createClient({ port: settings.db.redis.port });

// set redis client error messages
objRedisClient.on('error', err => { console.log(err); });

// set JWT Redis session settings
objRedisSettings = settings.auth.session;
objRedisSettings.client = objRedisClient;

// var objSettingsRedisSession          = {};
// objSettingsRedisSession.client       = clientRedis;
// objSettingsRedisSession.port         = settings.db.redis.port;

// var objSettingsSession               = {};
// objSettingsSession.resave            = false;
// objSettingsSession.saveUninitialized = false;
// objSettingsSession.store             = new RedisStore(objSettingsRedisSession);
// objSettingsSession.secret            = 'too5tup!tToF!ndMy0wn5ecret';

// connect mongoose
mongoose.connect(settings.db.mongoDb.uri);

// *****************************************************************************
// App configuration
// *****************************************************************************

app.use(express.static(strStaticFolder));
app.use(JWTRedisSession(objRedisSettings));
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
