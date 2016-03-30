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
require('./settings/general.settings.js');
require('./settings/database.settings.js');
require('./settings/auth.settings.js');
require('./settings/errors.settings.js');
require('./settings/paths.settings.js');
require('./settings/captcha.settings.js');

// setup errors by loading the library
require('./libs/error.lib.js');

// requires
var express               = require('express');
var redis                 = require('redis');
var mongoose              = require('mongoose');
var morgan                = require('morgan');
var path                  = require('path');
var childProcess          = require('child_process');
var bodyParser            = require('body-parser');
var JWTRedisSession       = require('jwt-redis-session');

// setup
var env                   = (process.env.NODE_ENV || 'dev');
var port                  = (process.env.PORT     || settings.general.system.port)*1;
var app                   = express();
var strStaticFolderClient = path.join(__dirname, '../.build/', env);
var strStaticFolderAdmin  = path.join(__dirname, '../.build/', env + '-admin');
var objRedisClient, objRedisSettings;

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

global.clients = { redis: objRedisClient };

// *****************************************************************************
// Application configuration
// *****************************************************************************

// enabling
app.use('/',      express.static(strStaticFolderClient));
app.use('/admin', express.static(strStaticFolderAdmin));
app.use(bodyParser.json());
app.use(JWTRedisSession(objRedisSettings));

// disabling
app.disable('x-powered-by');

// *****************************************************************************
// Routers and setups
// *****************************************************************************

// Routers
var commonRouter = require('./components/common/common.routes.js').init(app, env);
var authRouter   = require('./components/auth/auth.routes.js').init(app, env);
var userRouter   = require('./components/user/user.routes.js').init(app, env);

// public routes
commonRouter.public();
authRouter.public();

// private routes
authRouter.authorize();
authRouter.private();
userRouter.private();

// *****************************************************************************
// Error handling
// *****************************************************************************

// error handling
app.use((err, req, res, next) => {
    if (err && 'GET' === req.method) {
        return res.status(401).redirect('/');
    }
    else if (err) {
        return res.status(err.statusCode || 500).json(err);
    }
    else if (!err) {
        next();
    }
    return res.status(500).json({});
});

// general 404 handling
app.use((err, req, res, next) => {
    res.status(404).sendFile('404.html');
});

// *****************************************************************************
// Startup
// *****************************************************************************

app.listen(port, () => {
    console.log(`Node-Server running on port ${port} in environment ${env}!`);
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

})();
