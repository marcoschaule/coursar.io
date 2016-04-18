/**
 * @name        CioInterceptorService
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
    .factory('CioInterceptorService', Service);

// *****************************************************************************
// Service definition function
// *****************************************************************************

/* @ngInject */
function Service($window) {
    var service = {};

    // *************************************************************************
    // Private variables
    // *************************************************************************

    // *************************************************************************
    // Public variables
    // *************************************************************************

    // *************************************************************************
    // Service function linking
    // *************************************************************************

    service.request       = interceptRequest;
    service.requestError  = interceptRequestError;
    service.response      = interceptResponse;
    service.responseError = interceptResponseError;

    // *************************************************************************
    // Service function definitions
    // *************************************************************************

    /**
     * Service function to intercept the request.
     * 
     * @public
     * @param  {Object} objRequest  object of the request config
     * @return {Object}             object of the request config, extended by header information
     */
    function interceptRequest(objRequest) {
        objRequest.headers = _extendHeaders(objRequest.headers);
        return objRequest;
    }

    // *************************************************************************

    /**
     * Service function to intercept the request in error case.
     * 
     * @public
     * @param  {Object} objRequest  object of the rejection object
     * @return {Object}             object of the rejection object
     */
    function interceptRequestError(objRejection) {
        console.error(objRejection);
        return objRejection;
    }

    // *****************************************************************************

    /**
     * Service function to intercept the response.
     * 
     * @public
     * @param  {Object} objRequest  object of the response config to extract header information
     * @return {Object}             object of the response config
     */
    function interceptResponse(objResponse) {
        _readHeaders(objResponse.headers);
        return objResponse;
    }

    // *************************************************************************

    /**
     * Service function to intercept the response in error case.
     * 
     * @public
     * @param  {Object} objRequest  object of the rejection object
     * @return {Object}             object of the rejection object
     */
    function interceptResponseError(objRejection) {
        console.error(objRejection);
        return objRejection;
    }

    // *************************************************************************
    // Helper function definitions
    // *************************************************************************

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

    // *************************************************************************

    /**
     * Helper function to handle delivered tokens. If any token is send from
     * server, that means, that token needs to be refreshed (overridden) here
     * on client side.
     * 
     * @private
     * @param {Function} headers  function to acquire the header information
     */
    function _readHeaders(headers) {
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

    // *************************************************************************

    return service;

    // *************************************************************************
}

// *****************************************************************************
// Add Interceptor to config
// *****************************************************************************

angular
    .module('cio')
    .config(['$httpProvider', function($httpProvider) {  
        $httpProvider.interceptors.push('CioInterceptorService');
    }]);

// *****************************************************************************

})();
