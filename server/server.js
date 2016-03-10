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

// requires
var express               = require('express');
var redis                 = require('redis');
var mongoose              = require('mongoose');
var morgan                = require('morgan');
var path                  = require('path');
var childProcess          = require('child_process');
var bodyParser            = require('body-parser');
var csrf                  = require('csurf');
var JWTRedisSession       = require('jwt-redis-session');

// setup
var env                   = (process.env.NODE_ENV || 'dev');
var port                  = (process.env.PORT     || settings.general.system.port)*1;
var app                   = express();
var strStaticFolder       = path.join(__dirname, '../.build/', env);
var csrfProtection        = csrf({ sessionKey: 'session' });
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
// Controllers
// *****************************************************************************

// route setters
var setupRoutesAuthPublic = require('./components/auth/auth.routes.js').public;

// *****************************************************************************
// App configuration
// *****************************************************************************

// enabling
app.use(express.static(strStaticFolder));
app.use(bodyParser.json());
app.use(JWTRedisSession(objRedisSettings));

app.use((req, res, next) => {
    // console.log(">>> Debug ====================; req.headers:", req.headers, '\n\n');
    return next();
});
// app.use(function addCSRFToken(req, res, next) {
//     if (req.csrfToken) {
//         res.set('x-csrf-token', req.csrfToken());
//     }
//     return next();
// });

// disabling
app.disable('x-powered-by');



// *****************************************************************************
// Routing - admin routes
// *****************************************************************************

// *****************************************************************************
// Routing - privates routes
// *****************************************************************************


// *****************************************************************************
// Routing - public routes
// *****************************************************************************

// initialize component routes
setupRoutesAuthPublic(app);

app.get('/test', (req, res, next) => { // TODO: remove
    res.send('isSingedIn: ' + !!req.session.isSingedIn);
});
app.put('/test', (req, res, next) => { // TODO: remove
    res.send({ isSingedIn: !!req.session.isSingedIn });
});
app.get('/*?', (req, res, next) => {
    res.sendFile(path.join(strStaticFolder, 'layout.html'));
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
    console.log(`Node-Server running on port ${port} in environment ${env}!`);
});

// *****************************************************************************
// Helper functions
// *****************************************************************************

})();
