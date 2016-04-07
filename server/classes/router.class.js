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
    var router = new Router(objRoutes);
    return (objApp, strEnv) => {
        router.app = objApp;
        router.env = strEnv;
        return router;
    };
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
        this.app    = null;
        this.env    = null;
        this.routes = {
            public   : objRoutes.public,
            private  : objRoutes.private,
            authorize: objRoutes.authorize,
        };
    }

    // *************************************************************************

    /**
     * Public Router method to setup the public routes.
     * 
     * @public
     * @return {Object}  object of the Router object itself
     */
    public() {
        this._route('public');
        return this;
    }

    // *************************************************************************

    /**
     * Public Router method to setup the private routes.
     * 
     * @public
     * @return {Object}  object of the Router object itself
     */
    private() {
        this._route('private');
        return this;
    }

    // *************************************************************************

    /**
     * Public Router method to setup the authorization.
     * 
     * @public
     * @return {Object}  object of the Router object itself
     */
    authorize() {
        this._authorize();
        return this;
    }

    // *************************************************************************
    // Private Router methods
    // *************************************************************************

    /**
     * Private Router method to set the routes for an defined environment and key.
     *
     * @private
     * @param {String} strKey  string of the kind of routes (public, private or authorize)
     */
    _route(strKey) {
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
                arrRouteDefinitions = arrRoutes[0];
                if ('string' !== typeof arrRouteDefinitions[0]) {
                    throw new Error('Array of router definitions expects first element to be a string!');
                }
                this.app[strMethod].apply(this.app, arrRouteDefinitions);
            }
        }
    }

    // *************************************************************************

    /**
     * Private router function to setup the authorization routes.
     *
     * @private
     */
    _authorize() {
        if (!this.routes.authorize || !this.routes.authorize.length) {
            throw new Error('The routes are not defined for authorization!');
        }

        for (var i = 0; i < this.routes.authorize.length; i += 1) {
            this.app.use(this.routes.authorize[i]);
        }
    }
}

// *****************************************************************************

})();