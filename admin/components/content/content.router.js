/**
 * Cases:
 *
 *     Overview                             /contents
 *     Learning basic new                   /content-basic
 *     Learning basic edit                  /content-basic/:id
 *     Learning presentation new            /content-presentation
 *     Learning presentation edit           /content-presentation/:id
 *     Learning stream new                  /content-stream
 *     Learning stream edit                 /content-stream/:id
 *     Exercising multiple choice new       /content-multiple-choice
 *     Exercising multiple choice edit      /content-multiple-choice/:id
 *     Exercising practical new             /content-practical
 *     Exercising practical edit            /content-practical/:id
 *     Exercising complete text new         /content-complete-text
 *     Exercising complete text edit        /content-complete-text/:id
 *     Exercising complete sequence new     /content-complete-sequence
 *     Exercising complete sequence edit    /content-complete-sequence/:id
 */
(function() { 'use strict';

// *****************************************************************************
// Abstract state definitions
// *****************************************************************************

/**
 * Abstract state for content base.
 * @type {Object}
 */
var stateContent = {
    name: 'contents',
    views: {
        navigation: { templateUrl: 'layout-navigation.template.html' },
        main      : { template   : '<ui-view/>' },
    },
};

// *****************************************************************************
// Full state definitions
// *****************************************************************************

/**
 * State for the content overview.
 * @type {Object}
 */
var stateContentOverview = {
    url        : '/contents',
    name       : 'contents.overview',
    controller : 'CioContentOverviewCtrl as vm',
    templateUrl: 'content-overview.template.html',
};

/**
 * State for creating a new learning content "basic".
 * @type {Object}
 */
var stateContentLearningBasicNew = {
    url        : '/content-basic',
    name       : 'contents.basicNew',
    controller : 'CioContentBasicCtrl as vm',
    templateUrl: 'content-basic-new.template.html',
};

/**
 * State for editing an existing learning content "basic".
 * @type {Object}
 */
var stateContentLearningBasicEdit = {
    url        : '/content-basic/:id',
    name       : 'contents.basicEdit',
    controller : 'CioContentBasicCtrl as vm',
    templateUrl: 'content-basic.template.html',
    params     : { id: null, content: null }
};

// *****************************************************************************
// Router
// *****************************************************************************

angular
    .module('cio-routes')
    .config(function($stateProvider) {
        $stateProvider
            .state(stateContent)
            .state(stateContentOverview)
            .state(stateContentLearningBasicNew)
            .state(stateContentLearningBasicEdit)
            ;
    });

// *****************************************************************************

})();
