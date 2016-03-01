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
    .controller('CioComService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

function Service($http) {
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
        var strIdentifier = strMethod + '-' + strUrl;
        var objCanceler   = _objCancelers[strIdentifier];
        var objRequest;

        // cancel the request if necessary
        objCanceler &&
            objCanceler.resolve &&
            objCanceler.resolve('restart');

        objCanceler = $q.defer();
        objRequest  = {
            method : strMethod.toUpperCase(),
            url    : strUrl,
            data   : objData,
            headers: objHeaders,
            timeout: objCanceler.promise,
        };

        objCanceler = $http(objRequest).then(
            _requestCallback(strIdentifier, false), // false = is not error case
            _requestCallback(strIdentifier, true)); // true  = is error case
    }

    // *****************************************************************************

    function _requestCallback(strIdentifier, isError) {

        // return the "$http" success and error callback
        return function(mixData, numStatus, headers, objConfig, strStatusText) {
            var objErr = isError ? { statusCode: numStatus, message: strStatusText } : null;

            // delete canceler of HTTP request
            delete _objCancelers[strIdentifier];

            // call a "normal" callback where first element is the error object
            return callback(objErr, mixData, numStatus);
        };
    }

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['$http'];

// *****************************************************************************

})();
