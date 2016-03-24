(function() { `use strict`;

// *****************************************************************************
// Authentication errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.COMMON.GENERAL|
    Authentication error: an unexpected error occurred.`);

// *****************************************************************************
// Authentication sign in errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SIGN_IN.GENERAL|
    Authentication sign in error: an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.SIGN_IN.USER_NOT_FOUND|
    Authentication sign in error: user not found.`);

setError(`500|ERRORS.AUTH.SIGN_IN.UPDATE_FAILED|
    Authentication sign in error: the update of the user's data failed.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_INCORRECT|
    Authentication sign in error: username incorrect.`);

setError(`401|ERRORS.AUTH.SIGN_IN.EMAIL_INCORRECT|
    Authentication sign in error: email incorrect.`);

setError(`401|ERRORS.AUTH.SIGN_IN.PASSWORD_INCORRECT|
    Authentication sign in error: email invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_OR_PASSWORD_INCORRECT|
    Authentication sign in error: username or password invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.EMAIL_OR_PASSWORD_INCORRECT|
    Authentication sign in error: email or password invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_EMAIL_OR_PASSWORD_INCORRECT|
    Authentication sign in error: email or password invalid.`);

setError(`500|ERRORS.AUTH.SIGN_IN.SESSION_GENERATION|
    Authentication session error: session could not be generated.`);

// *****************************************************************************
// Authentication sign up errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SIGN_UP.GENERAL|
    Authentication sign up error: an unexpected error occurred.`);

setError(`406|ERRORS.AUTH.SIGN_UP.USERNAME_NOT_AVAILABLE|
    Authentication sign up error: the username is not available.`);

setError(`406|ERRORS.AUTH.SIGN_UP.EMAIL_NOT_AVAILABLE|
    Authentication sign up error: the email is not available.`);

setError(`406|ERRORS.AUTH.SIGN_UP.FIND_USER|
    Authentication sign up error: error with testing if the user exists.`);

setError(`406|ERRORS.AUTH.SIGN_UP.CREATE_USER|
    Authentication sign up error: error with creating the user.`);

setError(`406|ERRORS.AUTH.SIGN_UP.SEND_VERIFICATION_EMAIL|
    Authentication sign up error: error with creating the user.`);

// *****************************************************************************
// Authentication sign out errors
// *****************************************************************************

// *****************************************************************************

})();