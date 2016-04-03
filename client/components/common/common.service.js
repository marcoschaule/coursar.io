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

/* @ngInject */
function Service($rootScope, $state, $window, $timeout, $http, $q) {
    var service = {};

    // *****************************************************************************
    // Private variables
    // *****************************************************************************

    var _numRepeatCounter  = 4;
    var _numRepeatPeriod   = 800; // pause period in milliseconds
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

    service.get         = get;
    service.post        = post;
    service.put         = put;
    service.patch       = patch;
    service.remove      = remove;
    service.deleteToken = deleteToken;

    // *****************************************************************************
    // Service function definitions
    // *****************************************************************************

    /**
     * Service function to send a "GET" request to the server.
     * @public
     *
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function get(objRequest, callback) {
        return _prepareRequest('GET', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send a "POST" request to the server.
     * 
     * @public
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function post(objRequest, callback) {
        return _prepareRequest('POST', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send a "PUT" request to the server.
     * 
     * @public
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function put(objRequest, callback) {
        return _prepareRequest('PUT', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send a "GET" request to the server.
     * 
     * @public
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function patch(objRequest, callback) {
        return _prepareRequest('PATCH', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to send a "DELETE" request to the server.
     * 
     * @public
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function remove(objRequest, callback) {
        return _prepareRequest('DELETE', objRequest, callback);
    }

    // *****************************************************************************

    /**
     * Service function to delete a token from the local storage.
     *
     * @public
     * @param {String} strTokenName  string of the name of the token
     */
    function deleteToken(strTokenName) {
        if ('X-Access-Token' === strTokenName) {
            strTokenName = 'accessToken';
        }
        else if ('X-CSRF-Token' === strTokenName) {
            strTokenName = 'csrfToken';
        }
        return $window.localStorage.removeItem(strTokenName);
    }

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    /**
     * Helper function to prepare for request by choosing between request
     * with or without timeout. Also, the request object is checked if both the
     * unique identifier and the URL is set. If not, the function throws an
     * exception.
     * 
     * @private
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isTimeout]          (optional) true if request uses a timeout
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function _prepareRequest(strMethod, objRequest, callback) {
        var _numRepeatCounterLocal = _numRepeatCounter + 1;
        var _sendRequestFinal      = objRequest.isTimeout ? _requestWithTimeout : _request;

        if (!objRequest.id) {
            throw new Error('Request identifier is not set!');
        }
        if (!objRequest.url) {
            throw new Error('Request URL is not set!');
        }

        objRequest.headers = objRequest.headers || {};
        objRequest.data    = objRequest.data    || {};

        function __sendRequest() {
            return _sendRequestFinal(strMethod, objRequest, function(objErr, objResult) {

                // if there is an error, try x times to repeat the request
                if (objErr &&
                        !objResult.redirect &&
                        !objResult.disableRepeater &&
                        (_numRepeatCounterLocal-=1) >= 0) {
                    return $timeout(__sendRequest, _numRepeatPeriod);
                }

                $rootScope.flags.isProcessing = false;

                // if backend responds with a redirect, perform it
                if (!$state.current.public && objResult.redirect) {
                    deleteToken('accessToken');
                    return $state.go('signIn');
                }

                // if any other error occured, return that error
                if (objErr) {
                    return callback(objErr.err || objErr);
                }

                // otherweise proceed to succeed
                return callback(null, objResult);
            });
        } __sendRequest();
    }

    // *****************************************************************************

    /**
     * Helper function to request the server. This function uses the "$http"
     * service to fire the request. If the same request is fired again, the
     * previous one is canceled.
     * 
     * @private
     * @param {Object}   strMethod                       string of used HTTP method
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function _request(strMethod, objRequest, callback) {
        var strIdentifier = objRequest.id;

        // activate the processing to enable spinners and wait functions, etc.
        !objRequest.isSpinnerDisabled && ($rootScope.flags.isProcessing = true);

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
            _requestCallback(objRequest, false, callback), // false = is not error case
            _requestCallback(objRequest, true, callback)); // true  = is error case
    }

    // *****************************************************************************

    /**
     * Helper function to request with timeout the server.
     * 
     * @private
     * @param {Object}   strMethod                       string of used HTTP method
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {String}   objRequest.url                  string of the URL to be called
     * @param {String}   objRequest.data                 object of the user data to be added
     * @param {Object}   objRequest.headers              object of the headers to be added
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Function} callback                        function for callback
     */
    function _requestWithTimeout(strMethod, objRequest, callback) {
        var strIdentifier = objRequest.id;

        // cancel timeout of previous sign up request
        $timeout.cancel(_objTimeouts[strIdentifier]);
        
        // activate the processing to enable spinners and wait functions, etc.
        !!objRequest.isSpinnerDisabled && ($rootScope.flags.isProcessing = true);

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
     * 
     * @private
     * @param {Object}   objRequest                      object of request info and data
     * @param {String}   objRequest.id                   string of an unique identifier for the request
     * @param {Boolean}  [objRequest.isSpinnerDisabled]  (optional) true if request activates spinner
     * @param {Boolean}  isError                         true if error occurred
     * @param {Function} callback                        function for callback
     */
    function _requestCallback(objRequest, isError, callback) {
        var strIdentifier = objRequest.id;
        var objErr;

        // return the "$http" success and error callback
        return function(objResult) {
            
            // write all tokens in session storage; if there is any token send
            // from server, that means, token needs to be refreshed
            _handleTokens(objResult.headers);

            // if it was an error, set the error object with the
            // whole result data object.
            objErr = isError && objResult.data || null;

            // deactivate canceler of HTTP request
            _objCancelers[strIdentifier] = null;

            // deactivate canceler of timeout 
            _objTimeouts[strIdentifier] = null;

            // deactivate the processing
            // !objRequest.isSpinnerDisabled && ($rootScope.flags.isProcessing = false);

            // call a "normal" callback where first element is the error object
            return callback(objErr, objResult.data, objResult.status);
        };
    }

    // *****************************************************************************

    /**
     * Helper function to handle delivered tokens. If any token is send from
     * server, that means, that token needs to be refreshed (overridden) here
     * on client side.
     * 
     * @private
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
     * 
     * @private
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

})();
