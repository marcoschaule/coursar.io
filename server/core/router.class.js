(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var _ = require('underscore');

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = CreateRouter;

// *****************************************************************************
// Factory
// *****************************************************************************

/**
 * Public Router factory function to create a router object
 * with the object of the routes.
 *
 * @public
 * @param {Object} objRoutes  object of the routes to be defined
 */
function CreateRouter(objRoutes) {
    return new Router(objRoutes);
}

// *****************************************************************************
// Router class definition
// *****************************************************************************

class Router {

    // *************************************************************************
    // Public Router methods
    // *************************************************************************

    /**
     * Public Router constructor to instantiate the Router class
     * with the object of the routes.
     *
     * @public
     * @param {Object} objRoutes  object of the routes to be defined
     */
    constructor(objRoutes) {
        this.routes = {};

        if (objRoutes.public) {
            this.routes.public = objRoutes.public;
        }
        if (objRoutes.private) {
            this.routes.private = objRoutes.private;
        }
        if (objRoutes.authorize) {
            this.routes.authorize = objRoutes.authorize;
        }
    }

    // *************************************************************************

    /**
     * Public Router method to setup the public routes.
     * 
     * @public
     * @param {Object} app  object of the Express application instance
     * @return {Object}     object of the Router object itself
     */
    public(app) {
        this._route('public', app);
        return this;
    }

    // *************************************************************************

    /**
     * Public Router method to setup the private routes.
     * 
     * @public
     * @param {Object} app  object of the Express application instance
     * @return {Object}     object of the Router object itself
     */
    private(app) {
        this._route('private', app);
        return this;
    }

    // *************************************************************************

    /**
     * Public Router method to setup the authorization.
     * 
     * @public
     * @param {Object} app  object of the Express application instance
     * @return {Object}     object of the Router object itself
     */
    authorize(app) {
        this._authorize(app);
        return this;
    }

    // *************************************************************************
    // Private Router methods
    // *************************************************************************

    /**
     * Private Router method to set the routes for a defined key.
     *
     * @private
     * @param {String} strKey  string of the kind of routes (public, private or authorize)
     * @param {Object} app     object of the Express application instance
     */
    _route(strKey, app) {
        if (!this.routes[strKey]) {
            throw new Error(`The routes are not defined for the key ${strKey}!`);
        }

        var objRoutes  = this.routes[strKey];
        var arrMethods = Object.keys(objRoutes);
        var i, j, strMethod, arrRoutes, arrRouteDefinitions;

        for (i = 0; i < arrMethods.length; i += 1) {
            strMethod = arrMethods[i];
            arrRoutes = objRoutes[strMethod];

            for (j = 0; j < arrRoutes.length; j += 1) {
                arrRouteDefinitions = arrRoutes[j];
                if ('string' !== typeof arrRouteDefinitions[0]) {
                    throw new Error('Array of router definitions expects first element to be a string!');
                }

                app[strMethod].apply(app, arrRouteDefinitions);
            }
        }
    }

    // *************************************************************************

    /**
     * Private router function to setup the authorization routes.
     *
     * @private
     */
    _authorize(app) {
        if (!this.routes.authorize || !this.routes.authorize.length) {
            throw new Error('The routes are not defined for authorization!');
        }

        for (var i = 0; i < this.routes.authorize.length; i += 1) {
            app.use(this.routes.authorize[i]);
        }
    }
}

// *****************************************************************************

})();