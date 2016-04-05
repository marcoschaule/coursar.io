(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

module.exports.testDateOfBirth = testDateOfBirth;

// *****************************************************************************
// Library functions
// *****************************************************************************

/**
 * Library function to test if the entered date is valid and if the person
 * is older than two and younger than hundred years.
 *
 * @public
 * @param  {String}  strDate  string of the date to be tested
 * @return {Boolean}          true if the date is valid
 */
function testDateOfBirth(strDate) {
    var oneTwoYear        = 365*24*60*60*1000;
    var numTwoYears       =   2 * oneTwoYear;
    var numHunYears       = 100 * oneTwoYear;
    var regexDateOfBirth  = /^((\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/;
    var isValid = true;

    isValid = isValid && regexDateOfBirth.test(strDate);
    isValid = isValid && !!(new Date(strDate)).getDate();
    isValid = isValid && Date.now() - numTwoYears > Date.parse(strDate);
    isValid = isValid && Date.now() - numHunYears < Date.parse(strDate);

    return !!isValid;
}

// *****************************************************************************

})();