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

function Controller($http, $q) {
    var vm = this;

    // *****************************************************************************
    // Private variables
    // *****************************************************************************
    
    var _objCanceler;

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    vm.isUsernameAvailable;
    vm.isEmailAvailable;

    // *****************************************************************************
    // Controller function linking
    // *****************************************************************************

    vm.init        = init;
    vm.isAvailable = isAvailable;

    // *****************************************************************************
    // Controller function definitions
    // *****************************************************************************

    function isAvailable(strWhich, strValue) {
        var objRequestBody, objOptions;

        // cancel the request if necessary
        _objCanceler &&
            _objCanceler.resolve &&
            _objCanceler.resolve('restart');

        _objCanceler             = $q.defer();
        objRequestBody           = {};
        objRequestBody[strWhich] = strValue;
        objOptions               = { timeout: _objCanceler.promise };

        strWhich === 'email' ?
            (vm.isEmailAvailable = undefined) :
            (vm.isUsernameAvailable = undefined);

        $http.post('/is-available', objRequestBody, objOptions)
            .then(function(objResult) {
                strWhich === 'email' ?
                    (vm.isEmailAvailable = !!objResult.data.isAvailable) :
                    (vm.isUsernameAvailable = !!objResult.data.isAvailable);
            });
    }

    function init() {

    } init();

    // *****************************************************************************
    // Helper function definitions
    // *****************************************************************************

    // *****************************************************************************
}

// *****************************************************************************

Controller.$inject = ['$http', '$q'];

// *****************************************************************************

})();
