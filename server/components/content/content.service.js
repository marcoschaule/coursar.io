(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.createContent  = createContent;
module.exports.readContent    = readContent;
module.exports.updateContent  = updateContent;
module.exports.deleteContent  = deleteContent;
module.exports.createContents = createContents;
module.exports.readContents   = readContents;
module.exports.updateContents = updateContents;
module.exports.deleteContents = deleteContents;

// *****************************************************************************
// Service functions - default CRUD functions
// *****************************************************************************

/**
 * Service function to create one content element.
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function createContent(objCreate, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function readContent(strContentId, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function updateContent(objUpdate, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function deleteContent(strContentId, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function createContents(arrCreates, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function readContents(arrContentIds, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function updateContents(arrUpdates, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************

/**
 * Service function to
 * 
 * @pub
 * 
 * @param {[type]}   objCreate  to
 * @param {Function} callback   function for callback
 */
function deleteContents(arrContentIds, callback) {
    if (!callback || 'function' !== callback) {
        return console.error('Callback not defined or invalid!');
    }
}

// *****************************************************************************
// Helper functions
// *****************************************************************************

// *****************************************************************************

})();