module.exports = function(gulp) { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var wrap   = require('gulp-wrap');
var extend = require('gulp-extend');

var _arrLangKeys = ['en-US', 'de-DE'];
var _arrEnvs     = ['dev', 'dev-admin']; //, 'prod', 'prod-admin'];

// *****************************************************************************
// Basic tasks - languages
// *****************************************************************************

/**
 * Task to concat the languages for client development.
 */
gulp.task('lang:dev', ['lang:dev:en-US', 'lang:dev:de-DE']);

// *****************************************************************************

/**
 * Task to concat the languages for admin development.
 */
gulp.task('lang:dev-admin', ['lang:dev-admin:en-US', 'lang:dev-admin:de-DE']);

// *****************************************************************************

/**
 * Task to concat all translations of all environments.
 */
_gulpMakeAllLangTasks();

// *****************************************************************************
// Helper functions
// *****************************************************************************

/**
 * Helper function to make all language tasks with all environments and
 * all language keys.
 */
function _gulpMakeAllLangTasks() {
    return _arrEnvs.forEach(strEnv => {
        return _arrLangKeys.forEach(strLangKey => _gulpTaskLang(strEnv, strLangKey));
    });
}

// *****************************************************************************

/**
 * Helper function to set up the language task.
 *
 * @private
 * @param {String} strEnv      string of the environment like "dev" and "prod"
 * @param {String} strLangKey  string of the language key like "en-US"
 */
function _gulpTaskLang(strEnv, strLangKey) {
    var strFolder = strEnv.indexOf('admin') >= 0 ? 'admin' : 'client';

    gulp.task(`lang:${strEnv}:${strLangKey}`,
        () => gulp
            .src([`${strFolder}/components/**/*.${strLangKey}.json`])
            .pipe(extend(`translation.${strLangKey}.js`)) //use .js extension since we plan to wrap 
            .pipe(wrap(_wrapInTranslateProvider(strLangKey)))
            .pipe(gulp.dest(`./.build/${strEnv}/scripts/`))
    );
}

// *****************************************************************************

/**
 * Helper function to generate a translation configuration wrapper.
 * 
 * @private
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