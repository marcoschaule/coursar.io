/**
 * @name        CioSignUpCtrl
 * @author      Marc Stark <self@marcstark.com>
 * @file        This file is an AngularJS controller.
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
    .module('cio-controllers')
    .controller('CioSignUpCtrl', Controller);

// *****************************************************************************
// Controller definition function
// *****************************************************************************

function Controller($http, $timeout, $q, CioComService) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************
    
    var _objTimeouts       = {};
    var _numTimeoutDefault = 2000; // timeout in milliseconds
    var _objCanceler;              // TODO: replace by "request provider"

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.flags = {
        isAvailable: {
            username: 'pristine',
            email   : 'pristine',
        },
    };

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init        = init;
    vm.isAvailable = isAvailable;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function isAvailable(strWhich) {
        var objRequestBody, objOptions;
        var strValue = vm.modelSignUp[strWhich];

        // cancel timeout of previous availability test
        $timeout.cancel(_objTimeouts[strWhich]);

        // cancel the request if necessary
        _objCanceler &&
            _objCanceler.resolve &&
            _objCanceler.resolve('restart');

        // if user did not enter any text or text is
        // not valid, reset to pristine
        if (!strValue) {
            return _setTextForAvailability(strWhich, 'pristine');
        }

        _objCanceler             = $q.defer();
        objRequestBody           = {};
        objRequestBody[strWhich] = strValue;
        objOptions               = { timeout: _objCanceler.promise };

        // set text to "pending"
        _setTextForAvailability(strWhich, 'pending');

        // set timeout not to send every key stroke to the backend
        _objTimeouts[strWhich] = $timeout(function() {
            $http.put('/is-available', objRequestBody, objOptions)
                .then(function(objResult) {

                    // set text to "available" or "not available"
                    _setTextForAvailability(strWhich, !!objResult.data.isAvailable);

                    // delete timeout promise again
                    _objTimeouts[strWhich] = null;
                });
            }, _numTimeoutDefault);
    }

    // *****************************************************************************

    function init() {
        _resetTimeouts();
    } init();

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    function _resetTimeouts() {
        $timeout.cancel(_objTimeouts.username);
        $timeout.cancel(_objTimeouts.email);
        _objTimeouts.username = null;
        _objTimeouts.email    = null;
    }

    // *****************************************************************************

    function _setTextForAvailability(strWhich, mixValue) {
        var objFormField     = vm.formSignUp['signUp' + _capitalize(strWhich)];
        var isAvailableLocal = !!mixValue;

        if ('boolean' !== typeof mixValue) {
            return (vm.flags.isAvailable[strWhich] = mixValue);
        }

        // set availability
        vm.flags.isAvailable[strWhich] = 

            // if field is pristine
            (objFormField.$pristine && 'pristine') ||

            // if field is dirty but empty
            (objFormField.$dirty && !objFormField.$modelValue && 'pristine') ||

            // if field is dirty, but available
            (objFormField.$dirty && isAvailableLocal && true) ||

            // default value
            false;

    }

    // *****************************************************************************

    function _capitalize(strSrc) {
        return strSrc.substr(0,1).toUpperCase() + strSrc.substr(1).toLowerCase();
    }

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$http', '$timeout', '$q', CioComService];

// *****************************************************************************

})();
