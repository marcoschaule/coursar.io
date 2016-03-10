module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var childProcess = require('child_process');
var nodemon      = require('gulp-nodemon');
var exec         = childProcess.exec;
var spawn        = childProcess.spawn;
var serverMongoDB, serverRedis;

// *****************************************************************************
// Basic tasks - servers
// *****************************************************************************

/**
 * Task to start the Redis server.
 * 
 * spawn version: "serverRedis = spawn('redis-server');"
 */
gulp.task('server-redis', callback => {
    var numPortRedis = global.port+2;
    if (serverRedis && 'function' === typeof serverRedis.kill) {
        serverRedis.kill();
    }
    serverRedis = exec('redis-server --port ' + numPortRedis, (objErr) => {
        return ('function' === typeof callback && callback(objErr));
    });
    serverRedis.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
    serverRedis.on('exit', () => {
        console.log('Redis killed!');
    });
});
// *****************************************************************************

/**
 * Task to start the MongoBD server.
 * 
 * spawn version: "serverMongo = spawn('mongo-server');"
 */
gulp.task('server-mongodb', callback => {
    var numPortMongoDB = global.port+1;
    if (serverMongoDB && 'function' === typeof serverMongoDB.kill) {
        serverMongoDB.kill();
    }
    serverMongoDB = exec('mongod --dbpath ./.mongodb/ --port ' + numPortMongoDB, (objErr) => {
        return ('function' === typeof callback && callback(objErr));
    });
    serverMongoDB.stdout.on('data', (buffer) => {
        console.log(buffer.toString());
    });
    serverMongoDB.on('exit', () => {
        console.log('MongoDB killed!');
    });
});

// *****************************************************************************

/**
 * Task to start the Express server
 */
gulp.task('server-express', callback => nodemon({
        script: 'server/server.js',
        ignore: ['nodemon.json', 'build/*', 'client/*'],
        env   : {
            'NODE_ENV': global.env,
            'PORT'    : global.port,
        },
    })
);

// *****************************************************************************

};