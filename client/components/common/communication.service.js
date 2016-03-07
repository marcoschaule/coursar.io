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

function Service($rootScope, $window, $timeout, $http, $q) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _numTimeoutDefault = 400; // timeout in milliseconds
    var _objTimeouts       = {};
    var _objCancelers      = {};

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    $rootScope.flags = $rootScope.flags || {};

    // *****************************************************************************
    // Service function linking
    // *****************************************************************************

    service.get    = get;
    service.post   = post;
    service.put    = put;
    service.patch  = patch;
    service.remove = remove;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Function to send a "GET" request to the server.
     * @public
     *
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function get(objRequest, callback) {
        return _prepareRequest('GET', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "POST" request to the server.
     * @public
     * 
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {String}   obRequest.data         object of the user data to be added
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function post(objRequest, callback) {
        return _prepareRequest('POST', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "PUT" request to the server.
     * @public
     * 
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {String}   obRequest.data         object of the user data to be added
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function put(objRequest, callback) {
        return _prepareRequest('PUT', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "GET" request to the server.
     * @public
     * 
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {String}   obRequest.data         object of the user data to be added
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function patch(objRequest, callback) {
        return _prepareRequest('PATCH', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "DELETE" request to the server.
     * @public
     * 
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {String}   obRequest.data         object of the user data to be added
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function remove(objRequest, callback) {
        return _prepareRequest('DELETE', objRequest, callback);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to prepare for request by choosing between request
     * with or without timeout. Also, the request object is checked if both the
     * unique identifier and the URL is set. If not, the function throws an
     * exception.
     * @private
     * 
     * @param {Object}   obRequest              object of request info and data
     * @param {String}   obRequest.id           string of an unique identifier for the request
     * @param {String}   obRequest.url          string of the URL to be called
     * @param {String}   obRequest.data         object of the user data to be added
     * @param {Object}   obRequest.headers      object of the headers to be added
     * @param {Boolean}  [obRequest.isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback               function for callback
     */
    function _prepareRequest(strMethod, objRequest, callback) {
        if (!objRequest.id) {
            throw new Error('Request identifier is not set!');
        }
        if (!objRequest.url) {
            throw new Error('Request URL is not set!');
        }

        objRequest.data    = objRequest.data    || {};
        objRequest.headers = objRequest.headers || {};

        if (objRequest.isTimeout) {
            return _requestWithTimeout(strMethod, objRequest, callback);
        }
        return _request(objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Helper function to request the server. This function uses the "$http"
     * service to fire the request. If the same request is fired again, the
     * previous one is canceled.
     * @private
     * 
     * @param {Object}   strMethod          string of used HTTP method
     * @param {Object}   obRequest          object of request info and data
     * @param {String}   obRequest.id       string of an unique identifier for the request
     * @param {String}   obRequest.url      string of the URL to be called
     * @param {String}   obRequest.data     object of the user data to be added
     * @param {Object}   obRequest.headers  object of the headers to be added
     * @param {Function} callback           function for callback
     */
    function _request(strMethod, objRequest, callback) {
        var strIdentifier = objRequest.id;

        // activate the processing to enable spinners and wait functions, etc.
        $rootScope.flags.isProcessing = true;

        // extend header with tokens if they are available
        _extendHeaders(objRequest.headers);

        // cancel the request if necessary
        _objCancelers[strIdentifier] &&
            _objCancelers[strIdentifier].resolve &&
            _objCancelers[strIdentifier].resolve('restart');

        // reset the canceler object with a promise
        _objCancelers[strIdentifier] = $q.defer();

        // extend the request object
        objRequest.method  = strMethod.toUpperCase();
        objRequest.timeout = _objCancelers[strIdentifier].promise;

        return $http(objRequest).then(
            _requestCallback(strIdentifier, false, callback), // false = is not error case
            _requestCallback(strIdentifier, true, callback)); // true  = is error case
    }

    // *****************************************************************************

    /**
     * Helper function to request with timeout the server.
     * @private
     * 
     * @param {Object}   strMethod          string of used HTTP method
     * @param {Object}   obRequest          object of request info and data
     * @param {String}   obRequest.id       string of an unique identifier for the request
     * @param {String}   obRequest.url      string of the URL to be called
     * @param {String}   obRequest.data     object of the user data to be added
     * @param {Object}   obRequest.headers  object of the headers to be added
     * @param {Function} callback           function for callback
     */
    function _requestWithTimeout(strMethod, objRequest, callback) {
        var strIdentifier = objRequest.id;

        // cancel timeout of previous sign up request
        $timeout.cancel(_objTimeouts[strIdentifier]);
        
        // activate the processing to enable spinners and wait functions, etc.
        $rootScope.flags.isProcessing = true;

        // send request with timeout
        return (_objTimeouts[strIdentifier] = $timeout(function() {
            return _request(strMethod, objRequest, callback);
        }, _numTimeoutDefault));
    }

    // *****************************************************************************

    /**
     * Helper function to process request callbacks - in both success and error
     * scenario. This function transforms two different callbacks into one
     * callback with an error as first argument in error case.
     * @private
     * 
     * @param {String}   strIdentifier  string of identifier of HTTP request
     * @param {Boolean}  isError        true if error occurred
     * @param {Function} callback       function for callback
     */
    function _requestCallback(strIdentifier, isError, callback) {

        // return the "$http" success and error callback
        return function(objResult) {
            
            // write all tokens in session storage; if there is any token send
            // from server, that means, token needs to be refreshed
            _handleTokens(objResult.headers);

            var objErr = (isError ? { statusCode: objResult.status, message: objResult.statusText } : null);

            // deactivate canceler of HTTP request
            _objCancelers[strIdentifier] = null;

            // deactivate canceler of timeout 
            _objTimeouts[strIdentifier] = null;

            // deactivate the processing
            $rootScope.flags.isProcessing = false;

            // call a "normal" callback where first element is the error object
            return callback(objErr, objResult.data, objResult.status);
        };
    }

    // *****************************************************************************

    /**
     * Helper function to handle delivered tokens. If any token is send from
     * server, that means, that token needs to be refreshed (overridden) here
     * on client side.
     * @private
     * 
     * @param {Function} headers  function to get headers attached to the response
     */
    function _handleTokens(headers) {
        var strAccessToken = headers('X-Access-Token');
        var strCsrfToken   = headers('X-CSRF-Token');

        if ('delete' === strAccessToken) {
            $window.localStorage.removeItem('accessToken');
        }
        else if (strAccessToken) {
            $window.localStorage.accessToken = strAccessToken;
        }
        if ('delete' === strCsrfToken) {
            $window.localStorage.removeItem('csrfToken');
        }
        else if (strCsrfToken) {
            $window.localStorage.csrfToken = strCsrfToken;
        }
    }

    // *****************************************************************************

    /**
     * Helper function to extend the headers (object) with tokens if they
     * are available in local storage.
     * @private
     * 
     * @param  {Object} objHeaders  object of headers without tokens
     * @return {Object}             object of headers with tokens ... eventually
     */
    function _extendHeaders(objHeaders) {
        if ($window.localStorage.accessToken) {
            objHeaders['X-Access-Token'] = $window.localStorage.accessToken;
        }
        if ($window.localStorage.csrfToken) {
            objHeaders['X-CSRF-Token'] = $window.localStorage.csrfToken;
        }
        return objHeaders;
    }

    // *****************************************************************************

    return service;

    // *****************************************************************************
}

// *****************************************************************************

Service.$inject = ['$rootScope', '$window', '$timeout', '$http', '$q'];

// *****************************************************************************

})();
