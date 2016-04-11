(function() { 'use strict';

// *****************************************************************************
// State definitions
// *****************************************************************************

/**
 * State of the admin sign in view.
 * @type {Object}
 */
var stateContentOverview = {
    url   : '/contents',
    name  : 'contents',
    views : {
        navigation: {
            templateUrl: 'layout-navigation.template.html',
        },
        main: {
            controller : 'CioContentOverviewCtrl as vm',
            templateUrl: 'content-overview.template.html',
        },
    },
    public: true,
};

// *****************************************************************************

/**
 * State of the admin sign in view.
 * @type {Object}
 */
var stateContentLearningBasicNew = {
    url   : '/content-learning-basic-new',
    name  : 'contentLearningBasicNew',
    views : {
        navigation: {
            templateUrl: 'layout-navigation.template.html',
        },
        main: {
            controller : 'CioContentOverviewCtrl as vm',
            templateUrl: 'content-overview.template.html',
        },
    },
    public: true,
};

// *****************************************************************************
// Router
// *****************************************************************************

angular
    .module('cio-routes')
    .config(function($stateProvider) {
        $stateProvider
            .state(stateContentOverview)
            .state(stateContentLearningBasicNew)
            ;
    });

// *****************************************************************************

})();
