(function() { `use strict`;

// *****************************************************************************
// Authentication "common" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH_ADMIN.GENERAL|
    Authentication admin "general": an unexpected error occurred.`);

// *****************************************************************************
// Authentication "check key" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH_ADMIN.CHECK_KEY.GENERAL|
    Authentication admin "check key": an unexpected error occurred.`);

setError(`400|ERRORS.AUTH_ADMIN.CHECK_KEY.GIVEN_KEY_DIFFERENT|
    Authentication admin "check key": the given key is different from the expected one.`);

// *****************************************************************************
// Authentication "check admin" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH_ADMIN.CHECK_ADMIN.GENERAL|
    Authentication admin "check admin": an unexpected error occured.`);

setError(`401|ERRORS.AUTH_ADMIN.CHECK_ADMIN.IS_NO_ADMIN|
    Authentication admin "check admin": the user is no admin.`);

// *****************************************************************************

})();