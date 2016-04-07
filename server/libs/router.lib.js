(function() { 'use strict';

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = Router;

// *****************************************************************************
// Routes linking
// *****************************************************************************

/**
 * Router constructor to create the router class with the
 * app and the environment variables.
 *
 * @public
 * @param {Object} objApp  object of the Express app to define routes upon
 * @param {String} strEnv  string of the environment to define the routes in
 */
function Router(objApp, strEnv) {
    this.app    = objApp;
    this.env    = objEnv;
    this.isInit = true;
}

// *****************************************************************************

/**
 * Router function to set the routes for an defined environment.
 *
 * @public
 * @param {Object} objRoutes         object of the routes to be set
 * @param {Array}  objRoutes.get     array of all route definitions for the
 *                                   GET method, starting with the URL,
 *                                   followed by the middleware functions
 * @param {Array}  objRoutes.post    array of all route definitions for the
 *                                   POST method, starting with the URL,
 *                                   followed by the middleware functions
 * @param {Array}  objRoutes.put     array of all route definitions for the
 *                                   PUT method, starting with the URL,
 *                                   followed by the middleware functions
 * @param {Array}  objRoutes.delete  array of all route definitions for the
 *                                   DELETE method, starting with the URL,
 *                                   followed by the middleware functions
 * @param {Array}  objRoutes.patch   array of all route definitions for the
 *                                   PATCH method, starting with the URL,
 *                                   followed by the middleware functions
 */
Router.prototype.setRoutes = function(objRoutes) {
    var arrMethods = Object.keys(objRoutes);
    var i, j, strMethod, arrRouteDefinitions;

    for (i = 0; i < arrMethods.length; i += 1) {
        strMethod           = arrMethods[i];
        arrRouteDefinitions = objRoutes[strMethod];

        for (j = 0; j < arrRouteDefinitions.length; j += 1) {
            if ('string' !== arrRouteDefinitions[0]) {
                throw new Error('Array of router definitions expects first element to be a string!');
            }
            this.app[strMethod].apply(this.app, arrRouteDefinitions);
        }
    }
};

// *****************************************************************************

/**
 * Router function to set authorization middleware if necessary.
 *
 * @public
 * @param {Array} arrAuthFunctions  array of the authorization functions
 */
Router.prototype.setAuthorization = function(arrAuthFunctions) {
    var i;

    for (i = 0; i < arrAuthFunctions.length; i += 1) {
        this.app.use(arrAuthFunctions[i]);
    }
};

// *****************************************************************************

})();