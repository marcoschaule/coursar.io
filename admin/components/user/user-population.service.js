/**
 * @name        CioUserPopulationService
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS service.
 * 
 * @copyright   (c) 2015 marcstark.com, Marc Stark <self@marcstark.com>
 * @license     https://github.com/marcstark/coursar.io/blob/master/LICENSE
 * @readme      https://github.com/marcstark/coursar.io/blob/master/README
 */
(function() { 'use strict';

// *****************************************************************************
// Controller module
// *****************************************************************************

angular
    .module('cio-services')
    .factory('CioUserPopulationService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service() {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _arrGenders        = ['male', 'female', 'other'];
    var _arrTitles         = ['Dr.', 'Dr. med.', 'Prof.', 'Sir'];
    var _arrFirstNames     = ['Kevin', 'Wilbour', 'Steve', 'Handrick', 'Peter', 'Andy', 'Arthur', 'Ben', 'Julian', 'Harry', 'Thomas', 'Bill'];
    var _arrLastNames      = ['Jackson', 'Anderson', 'Crowford', 'Spielberg', 'Harrington', 'Cartright', 'Hower', 'Koch', 'Maher', 'Gross'];
    var _arrStreetNames    = ['Parker Str.', 'Lexington Str.', 'Uber Str.', 'Washington Str.', 'Hopestr.', 'New Yorker Str.', 'First Street'];
    var _arrCityNames      = ['New York', 'San Fransisco', 'Los Santos', 'Los Angeles', 'Wyoming', 'Huckeltown', 'Malborough'];
    var _arrEmailProviders = ['aol.com', 'gmx.de', 'mail.com', 'gmail.com', 'web.com'];

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.generatePopulation = generatePopulation;
    service.generateRandomUser = generateRandomUser;
    service.generatePassword   = generatePassword;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    function generatePopulation(numUsers) {
        var arrUsers = [], i;
        for (i = 0; i < numUsers; i += 1) {
            arrUsers.push(generateRandomUser());
        }
        return arrUsers;
    }

    // *****************************************************************************

    function generateRandomUser() {
        var objUser = {
            profile: {
                gender     : 'male',
                name       : _generateName(),
                dateOfBirth: _generateDateOfBirth(),
                address    : _generateAddress(),
            }
        };

        objUser.username = [
            objUser.profile.name.first,
            objUser.profile.name.last,
        ].join('.').toLowerCase();

        objUser.email = [
            objUser.username, '@',
            _arrEmailProviders[_randInt(0, _arrEmailProviders.length)],
        ].join('');

        objUser.passwordNew = generatePassword();

        return objUser;
    }

    // *************************************************************************

    /**
     * Service function to generate a random password.
     *
     * @public
     * @return {String}  string of randomly generated password
     */
    function generatePassword() {
        return Math.random().toString(36).slice(-8);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _generateName() {
        var hasTitle  = Math.random() > 0.9;
        var hasMiddle = Math.random() > 0.5;

        var objNames = {
            title : hasTitle && _arrTitles[_randInt(0, _arrTitles.length)] || '',
            first : _arrFirstNames[_randInt(0, _arrFirstNames.length)],
            middle: hasTitle && _arrFirstNames[_randInt(0, _arrFirstNames.length)] || '',
            last  : _arrLastNames[_randInt(0, _arrLastNames.length)]
        };

        return objNames;
    }

    // *************************************************************************

    function _generateAddress() {
        var objAddress = {
            street : _arrStreetNames[_randInt(0, _arrStreetNames.length)],
            city   : _arrCityNames[_randInt(0, _arrCityNames.length)],
            zipcode: _randInt(110000, 999999),
            coutry : 'USA',
        };

        return objAddress;
    }

    // *************************************************************************

    function _generateDateOfBirth() {
        var strMonth = String(_randInt(1, 12));
        var strDay   = String(_randInt(1, 30));
        var strYear  = String(_randInt(1970, 1990));
        var strDOB   = [
            (strMonth.length === 1 ? '0' : '') + strMonth,
            (strDay.length   === 1 ? '0' : '') + strDay,
            strYear
        ].join('/');

        return strDOB;
    } 

    // *************************************************************************

    function _randInt(numMin, numMax) {
        return Math.floor(Math.random() * (numMax - numMin)) + numMin;
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

})();
