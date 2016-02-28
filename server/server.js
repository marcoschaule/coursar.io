(function() { 'use strict';

// *****************************************************************************
// global constants
// *****************************************************************************

global.APPNAME = 'coursar.io';
global.APPURL  = 'coursar.io';

// ********************************************************************************
// Includes and definitions
// ********************************************************************************

// setup settings
require('./settings/general.settings.js').setup();
require('./settings/database.settings.js').setup();
require('./settings/auth.settings.js').setup();
require('./settings/errors.settings.js').setup();
require('./settings/paths.settings.js').setup();

// requires
var express             = require('express');
var redis               = require('redis');
var mongoose            = require('mongoose');
var morgan              = require('morgan');
var path                = require('path');
var childProcess        = require('child_process');
var bodyParser          = require('body-parser');
var JWTRedisSession     = require('jwt-redis-session');

// setup
var env                 = (process.env.NODE_ENV || 'dev');
var port                = (process.env.PORT     || 3000)*1;
var app                 = express();
var strStaticFolder     = path.join(__dirname, '../.build/', env);
var objRedisClient, objRedisSettings;

// Controllers
var AuthCtrl = require('./components/auth/auth.controller.js');

// route setters
var setupRoutesAuthPublic = require('./components/auth/auth.routes.js').public;

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

// connect mongoose
mongoose.connect(settings.db.mongoDb.uri);

// *****************************************************************************
// App configuration
// *****************************************************************************

app.use(express.static(strStaticFolder));
app.use(bodyParser.json());
app.use(JWTRedisSession(objRedisSettings));

// *****************************************************************************
// Routing - public routes
// *****************************************************************************

app.get('/', AuthCtrl.touchSignedIn, (req, res, next) => {
    res.sendFile(path.join(strStaticFolder, 'index.html'));
});

// initialize component routes
setupRoutesAuthPublic(app, AuthCtrl.touchSignedIn);

// set auth barrier for all following routes
app.use(AuthCtrl.checkSignedIn);

// test route
app.post('/test', (req, res, next) => {
    res.send('isSingedIn');
});

// *****************************************************************************
// Error handling
// *****************************************************************************

app.use((err, req, res, next) => {
    if (err) {
        return res.json({ err: err });
    }
    return res.json({});
});

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
