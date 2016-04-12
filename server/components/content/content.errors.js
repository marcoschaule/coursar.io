(function() { `use strict`;

// *****************************************************************************
// Content "common" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.GENERAL|
    Content "general": an unexpected error occurred.`);

// *****************************************************************************
// Content "create" errors
// *****************************************************************************

setError(`500|ERRORS.CONTENT.CREATE.GENERAL|
    Content "create": an unexpected error occurred.`);

setError(`500|ERRORS.CONTENT.CREATE.SAVE|
    Content "create": error while saving the data.`);

// *****************************************************************************

})();