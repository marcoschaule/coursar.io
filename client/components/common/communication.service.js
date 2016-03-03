/**
 * @name        CioAuthService
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
    .factory('CioComService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

function Service($http, $q) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _objCancelers = {};

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.get    = get;
    service.put    = put;
    service.patch  = patch;
    service.remove = remove;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    function get(strUrl, objHeaders, callback) {
        return _request('GET', strUrl, null, objHeaders, callback);
    }

    // *****************************************************************************

    function put(strUrl, objData, objHeaders, callback) {
        return _request('PUT', strUrl, objData, objHeaders, callback);
    }

    // *****************************************************************************

    function patch(strUrl, objData, objHeaders, callback) {
        return _request('PATCH', strUrl, objData, objHeaders, callback);
    }

    // *****************************************************************************

    function remove(strUrl, objData, objHeaders, callback) {
        return _request('DELETE', strUrl, objData, objHeaders, callback);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _request(strMethod, strUrl, objData, objHeaders, callback) {     
        var strIdentifier, objRequest;

        strIdentifier = strMethod.toLowerCase() + '-' + strUrl.replace(/\//g, '');

        if (objData.username) {
            strIdentifier += '-username';
        }
        if (objData.email) {
            strIdentifier += '-email';
        }

        if ('function' === typeof objHeaders && !callback) {
            callback = objHeaders;
        }

        // cancel the request if necessary
        _objCancelers[strIdentifier] &&
            _objCancelers[strIdentifier].resolve &&
            _objCancelers[strIdentifier].resolve('restart');

        _objCancelers[strIdentifier] = $q.defer();
        objRequest  = {
            method : strMethod.toUpperCase(),
            url    : strUrl,
            data   : objData,
            headers: objHeaders,
            timeout: _objCancelers[strIdentifier].promise,
        };

        return $http(objRequest).then(
            _requestCallback(strIdentifier, false, callback), // false = is not error case
            _requestCallback(strIdentifier, true, callback)); // true  = is error case
    }

    // *****************************************************************************

    function _requestCallback(strIdentifier, isError, callback) {

        // return the "$http" success and error callback
        return function(objResult) {
            var objErr = (isError ? { statusCode: objResult.status, message: objResult.statusText } : null);

            // delete canceler of HTTP request
            _objCancelers[strIdentifier] = null;

            // call a "normal" callback where first element is the error object
            return callback(objErr, objResult.data, objResult.status);
        };
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['$http', '$q'];

// *****************************************************************************

})();
