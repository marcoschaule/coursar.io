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
     * @param {String}   strUrl       string of the URL to be called
     * @param {Object}   objHeaders   object of the headers to be added
     * @param {Boolean}  [isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback     function for callback
     */
    function get(strUrl, objHeaders, isTimeout, callback) {
        return _prepareRequest('GET', strUrl, null, objHeaders, isTimeout, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "POST" request to the server.
     * @public
     * 
     * @param {String}   strUrl       string of the URL to be called
     * @param {Object}   objHeaders   object of the headers to be added
     * @param {Boolean}  [isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback     function for callback
     */
    function post(strUrl, objData, objHeaders, isTimeout, callback) {
        return _prepareRequest('POST', strUrl, objData, objHeaders, isTimeout, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "PUT" request to the server.
     * @public
     * 
     * @param {String}   strUrl       string of the URL to be called
     * @param {Object}   objData      object of user data to be added
     * @param {Object}   objHeaders   object of the headers to be added
     * @param {Boolean}  [isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback     function for callback
     */
    function put(strUrl, objData, objHeaders, isTimeout, callback) {
        return _prepareRequest('PUT', strUrl, objData, objHeaders, isTimeout, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "GET" request to the server.
     * @public
     * 
     * @param {String}   strUrl       string of the URL to be called
     * @param {Object}   objData      object of user data to be added
     * @param {Object}   objHeaders   object of the headers to be added
     * @param {Boolean}  [isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback     function for callback
     */
    function patch(strUrl, objData, objHeaders, isTimeout, callback) {
        return _prepareRequest('PATCH', strUrl, objData, objHeaders, isTimeout, callback);
    }

    // *****************************************************************************

    /**
     * Function to send a "DELETE" request to the server.
     * @public
     * 
     * @param {String}   strUrl       string of the URL to be called
     * @param {Object}   objData      object of user data to be added
     * @param {Object}   objHeaders   object of the headers to be added
     * @param {Boolean}  [isTimeout]  (optional) true if request uses a timeout
     * @param {Function} callback     function for callback
     */
    function remove(strUrl, objData, objHeaders, isTimeout, callback) {
        return _prepareRequest('DELETE', strUrl, objData, objHeaders, isTimeout, callback);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to prepare for request by choosing between request
     * with or without timeout.
     * @private
     * 
     * @param {String}   strUrl      string of the URL to be called
     * @param {Object}   objData     object of user data to be added
     * @param {Object}   objHeaders  object of the headers to be added
     * @param {Boolean}  isTimeout   true if request uses a timeout
     * @param {Function} callback    function for callback
     */
    function _prepareRequest(strMethod, strUrl, objData, objHeaders, isTimeout, callback) {
        if (isTimeout && 'boolean' === typeof isTimeout) {
            return _requestWithTimeout(strMethod, strUrl, objData, objHeaders, callback);
        }
        if (!callback && 'function' === typeof isTimeout) {
            callback = isTimeout;
        }
        return _request(strMethod, strUrl, objData, objHeaders, callback);
    }

    // *****************************************************************************

    /**
     * Helper function to request the server. This function uses the "$http"
     * service to fire the request. If the same request is fired again, the
     * previous one is canceled.
     * @private
     * 
     * @param {String}   strMethod   string of method to be used
     * @param {String}   strUrl      string of the URL to be called
     * @param {Object}   objData     object of user data to be added
     * @param {Object}   objHeaders  object of the headers to be added
     * @param {Function} callback    function for callback
     */
    function _request(strMethod, strUrl, objData, objHeaders, callback) {     
        var strIdentifier, objRequest;

        // activate the processing to enable spinners and wait functions, etc.
        $rootScope.flags.isProcessing = true;

        strIdentifier = strMethod.toLowerCase() + '-' + strUrl.replace(/\//g, '');

        if (objData.username) {
            strIdentifier += '-username';
        }
        if (objData.email) {
            strIdentifier += '-email';
        }

        if ('function' === typeof objHeaders && !callback) {
            callback   = objHeaders;
            objHeaders = {};
        }

        // extend header with tokens if they are available
        _extendHeaders(objHeaders);

        // cancel the request if necessary
        _objCancelers[strIdentifier] &&
            _objCancelers[strIdentifier].resolve &&
            _objCancelers[strIdentifier].resolve('restart');

        // reset the canceler object with a promise
        _objCancelers[strIdentifier] = $q.defer();

        // setup user data including timeout to cancel request if necessary
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

    /**
     * Helper function to request with timeout the server.
     * @private
     * 
     * @param {String}   strMethod   string of method to be used
     * @param {String}   strUrl      string of the URL to be called
     * @param {Object}   objData     object of user data to be added
     * @param {Object}   objHeaders  object of the headers to be added
     * @param {Function} callback    function for callback
     */
    function _requestWithTimeout(strMethod, strUrl, objData, objHeaders, callback) {     

        // cancel timeout of previous sign up request
        $timeout.cancel(_objTimeouts.signIn);
        
        // activate the processing to enable spinners and wait functions, etc.
        $rootScope.flags.isProcessing = true;

        // send request with timeout
        return (_objTimeouts.signIn = $timeout(function() {
            return _request(strMethod, strUrl, objData, objHeaders, callback);
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

            // delete canceler of HTTP request
            _objCancelers[strIdentifier] = null;

            // deactivate the processing again
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

        if (strAccessToken) {
            $window.localStorage.accessToken = strAccessToken;
        }
        if (strCsrfToken) {
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
