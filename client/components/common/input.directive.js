(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

angular
    .module('cio-directives')
    .directive('cioInputChangeEvent', Directive);

// *****************************************************************************

function Directive() {
    var directive = {};

    // *****************************************************************************
    // Public variables
    // *****************************************************************************

    directive.scope = { onchange: '&cioInputChangeEvent' };

    // *****************************************************************************
    // Directive functions linking
    // *****************************************************************************

    directive.link = link;

    // *****************************************************************************
    // Directive functions definition
    // *****************************************************************************

    /**
     * Directive link function to react on input change element.
     * @public
     * 
     * @param  {Object} objScope       object of local scope
     * @param  {Object} objElement     object of element the directive was added to
     * @param  {Array}  arrAttributes  array of attributes of the element
     */
    function link(objScope, objElement, arrAttributes) {
        return element.on('input', function() {
            return objScope.$apply(function() { objScope.onchange(); });
        });
    }

    // *****************************************************************************

    return directive;

    // *****************************************************************************
}

// *****************************************************************************

})();