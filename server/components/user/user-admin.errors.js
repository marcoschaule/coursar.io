(function() { `use strict`;

// *****************************************************************************
// Authentication "common" errors
// *****************************************************************************

setError(`500|ERRORS.USERS_ADMIN.GENERAL|
    Users admin "general": an unexpected error occurred.`);

// *****************************************************************************
// Authentication "create users" errors
// *****************************************************************************

setError(`500|ERRORS.USERS_ADMIN.CREATE_USERS.GENERAL|
    Users admin "create users": an unexpected error occurred.`);

setError(`400|ERRORS.USERS_ADMIN.CREATE_USERS.ARRAY_OF_USERS_EMPTY|
    Users admin "create users": array of users is empty.`);

// *****************************************************************************
// Authentication "read users" errors
// *****************************************************************************

setError(`500|ERRORS.USERS_ADMIN.READ_USERS.GENERAL|
    Users admin "read users": an unexpected error occured.`);

setError(`400|ERRORS.USERS_ADMIN.READ_USERS.ARRAY_OF_USER_IDS_EMPTY|
    Users admin "create users": array of user ids is empty.`);

// *****************************************************************************
// Authentication "update users" errors
// *****************************************************************************

setError(`500|ERRORS.USERS_ADMIN.UPDATE_USERS.GENERAL|
    Users admin "update users": an unexpected error occurred.`);

setError(`400|ERRORS.USERS_ADMIN.UPDATE_USERS.ARRAY_OF_USERS_EMPTY|
    Users admin "create users": array of users is empty.`);

setError(`500|ERRORS.USERS_ADMIN.UPDATE_USERS.READ_USERS|
    Users admin "update users": error with reading users after update.`);

// *****************************************************************************
// Authentication "delete users" errors
// *****************************************************************************

setError(`500|ERRORS.USERS_ADMIN.DELETE_USERS.GENERAL|
    Users admin "delete users": an unexpected error occured.`);

setError(`400|ERRORS.USERS_ADMIN.DELETE_USERS.ARRAY_OF_USER_IDS_EMPTY|
    Users admin "create users": array of user ids is empty.`);

// *****************************************************************************

})();