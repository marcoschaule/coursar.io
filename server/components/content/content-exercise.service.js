(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.testExercise = testExercise;

// *****************************************************************************
// Service functions
// *****************************************************************************

function testExercise() {

}

// *****************************************************************************
// Helper functions
// *****************************************************************************


/**
 * Helper function to test an exercise of the type "MultipleChoice".
 * 
 * @public
 * @param {Object}   objExercise  object of the exercise to be tested
 * @param {Function} callback     function for callback
 */
function _testExerciseMultipleChoice(objExercise, callback) {
    if (!callback || 'function' !== typeof callback) {
        return console.error('Callback not defined or invalid');
    }
}

// *****************************************************************************

/**
 * Helper function to test an exercise of the type "CompleteText".
 * 
 * @public
 * @param {Object}   objExercise  object of the exercise to be tested
 * @param {Function} callback     function for callback
 */
function _testExerciseCompleteText(objExercise, callback) {
    if (!callback || 'function' !== typeof callback) {
        return console.error('Callback not defined or invalid');
    }
}

// *****************************************************************************

/**
 * Helper function to test an exercise of the type "CompleteSequence".
 * 
 * @public
 * @param {Object}   objExercise  object of the exercise to be tested
 * @param {Function} callback     function for callback
 */
function _testExerciseCompleteSequence(objExercise, callback) {
    if (!callback || 'function' !== typeof callback) {
        return console.error('Callback not defined or invalid');
    }
}

// *****************************************************************************

/**
 * Helper function to test an exercise of the type "Practical".
 * 
 * @public
 * @param {Object}   objExercise  object of the exercise to be tested
 * @param {Function} callback     function for callback
 */
function _testExercisePractical(objExercise, callback) {
    if (!callback || 'function' !== typeof callback) {
        return console.error('Callback not defined or invalid');
    }
}

// *****************************************************************************

// *****************************************************************************

})();