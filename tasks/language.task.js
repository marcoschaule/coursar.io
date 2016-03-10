module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var wrap   = require('gulp-wrap');
var extend = require('gulp-extend');

// *****************************************************************************
// Basic tasks - languages
// *****************************************************************************

/**
 * Task to concat the languages for development.
 */
gulp.task('lang:dev', ['lang:dev:en-US', 'lang:dev:de-DE']);

// *****************************************************************************

/**
 * Task to concat translations of "en-US".
 */
gulp.task('lang:dev:en-US',
    () => gulp
        .src(['client/components/**/*.en-US.json'])
        .pipe(extend('translation.en-US.js')) //use .js extension since we plan to wrap 
        .pipe(wrap(_wrapInTranslateProvider('en-US')))
        .pipe(gulp.dest('./.build/dev/scripts/'))
);

// *****************************************************************************

/**
 * Task to concat translations of "de-DE".
 */
gulp.task('lang:dev:de-DE',
    () => gulp
        .src(['client/components/**/*.de-DE.json'])
        .pipe(extend('translation.de-DE.js')) //use .js extension since we plan to wrap 
        .pipe(wrap(_wrapInTranslateProvider('de-DE')))
        .pipe(gulp.dest('./.build/dev/scripts/'))
);

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to generate a translation configuration wrapper.
 * @private
 * 
 * @param  {String} strLanguage  string of the language key like "en-US"
 * @return {String}              string of the wrapper
 */
function _wrapInTranslateProvider(strLanguageKey) {
    var strWrapper = `angular.module('cio-values').config(function($translateProvider) {
        $translateProvider.translations('${strLanguageKey}', <%= contents %>);
    });`;
    return strWrapper;
}

// *****************************************************************************

};