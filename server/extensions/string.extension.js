(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

/**
 * String function to transform a string into dash case format.
 *
 * @public
 * @return {String}  string that is in dash case
 */
String.prototype.toDashCase = function() {
    return this
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
};

// *****************************************************************************

/**
 * String function to transform a string into dash case format and to
 * remove or replace all unsafe characters.
 *
 * @public
 * @return {String}  string that is in dash case without special characters
 */
String.prototype.toDashCaseSave = function() {
    return this
        .replace(/[ß]/g, 'ss')
        .replace(/[&]/g, '-and-')
        .replace(/[ä]/gi, 'ae')
        .replace(/[ü]/gi, 'ue')
        .replace(/[ö]/gi, 'oe')
        .replace(/[_/+]/g, '-')
        .toDashCase()
        .replace(/[^(a-zA-Z0-9-)]/g, '');
};

// *****************************************************************************

/**
 * String function to transform a string into camel case format.
 *
 * @public
 * @return {String}  string that is in camel case
 */
String.prototype.toCamelCase = function() {
    return this
        .toDashCase()
        .replace(/(-.)+/g, function($1) { return $1.toUpperCase(); })
        .replace(/-+/g, '');
};

// *****************************************************************************

/**
 * String function to transform a string into camel case format and to
 * remove or replace all unsafe characters.
 *
 * @public
 * @return {String}  string that is camel case without special characters
 */
String.prototype.toCamelCaseSave = function() {
    return this
        .toDashCaseSave()
        .replace(/(-.)+/g, function($1) { return $1.toUpperCase(); })
        .replace(/-+/g, '');
};

// *****************************************************************************

/**
 * String function to capitalize a string.
 *
 * @public
 * @return {String}  string that is capitalized
 */
String.prototype.capitalize = function() {
    return (this.charAt(0).toUpperCase() + this.substr(1).toLowerCase());
};

// *****************************************************************************

})();