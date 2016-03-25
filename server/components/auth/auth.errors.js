(function() { `use strict`;

// *****************************************************************************
// Authentication "common" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.GENERAL|
    Authentication "general": an unexpected error occurred.`);

// *****************************************************************************
// Authentication "sign in" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SIGN_IN.GENERAL|
    Authentication "sign in": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.SIGN_IN.USER_NOT_FOUND|
    Authentication "sign in": user not found.`);

setError(`500|ERRORS.AUTH.SIGN_IN.UPDATE_FAILED|
    Authentication "sign in": the update of the user's data failed.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_INCORRECT|
    Authentication "sign in": username incorrect.`);

setError(`401|ERRORS.AUTH.SIGN_IN.EMAIL_INCORRECT|
    Authentication "sign in": email incorrect.`);

setError(`401|ERRORS.AUTH.SIGN_IN.PASSWORD_INCORRECT|
    Authentication "sign in": email invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_OR_PASSWORD_INCORRECT|
    Authentication "sign in": username or password invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.EMAIL_OR_PASSWORD_INCORRECT|
    Authentication "sign in": email or password invalid.`);

setError(`401|ERRORS.AUTH.SIGN_IN.USERNAME_EMAIL_OR_PASSWORD_INCORRECT|
    Authentication "sign in": email or password invalid.`);

setError(`500|ERRORS.AUTH.SIGN_IN.SESSION_GENERATION|
    Authentication "session": session could not be generated.`);

// *****************************************************************************
// Authentication "sign up" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SIGN_UP.GENERAL|
    Authentication "sign up": an unexpected error occurred.`);

setError(`406|ERRORS.AUTH.SIGN_UP.USERNAME_NOT_AVAILABLE|
    Authentication "sign up": the username is not available.`);

setError(`406|ERRORS.AUTH.SIGN_UP.EMAIL_NOT_AVAILABLE|
    Authentication "sign up": the email is not available.`);

setError(`406|ERRORS.AUTH.SIGN_UP.FIND_USER|
    Authentication "sign up": error with testing if the user exists.`);

setError(`406|ERRORS.AUTH.SIGN_UP.CREATE_USER|
    Authentication "sign up": error with creating the user.`);

setError(`406|ERRORS.AUTH.SIGN_UP.SEND_VERIFICATION_EMAIL|
    Authentication "sign up": error with creating the user.`);

// *****************************************************************************
// Authentication "sign out" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SIGN_OUT.GENERAL|
    Authentication "sign out": an unexpected error occurred.`);

// *****************************************************************************
// Authentication "send verification email" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.SEND_VERIFICATION_EMAIL.GENERAL|
    Authentication "send verification email": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.SEND_VERIFICATION_EMAIL.SET_REDIS_ENTRY|
    Authentication "send verification email": error with setting Redis entry.`);

setError(`500|ERRORS.AUTH.SEND_VERIFICATION_EMAIL.SEND_EMAIL|
    Authentication "send verification email": error with sending email.`);

// *****************************************************************************
// Authentication "verify email" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.VERIFY_EMAIL.GENERAL|
    Authentication "verify email": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.VERIFY_EMAIL.GET_REDIS_ENTRY|
    Authentication "verify email": error with getting Redis entry.`);

setError(`500|ERRORS.AUTH.VERIFY_EMAIL.UPDATE_USER|
    Authentication "verify email": error with updating user.`);

setError(`500|ERRORS.AUTH.VERIFY_EMAIL.DELETE_REDIS_ENTRY|
    Authentication "verify email": error with deleting Redis entry.`);

// *****************************************************************************
// Authentication "forgot username" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.FORGOT_USERNAME.GENERAL|
    Authentication "forgot username": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.FORGOT_USERNAME.FIND_USER|
    Authentication "forgot username": error with finding user.`);

setError(`400|ERRORS.AUTH.FORGOT_USERNAME.USER_NOT_FOUND|
    Authentication "forgot username": user was not found.`);

setError(`500|ERRORS.AUTH.FORGOT_USERNAME.SEND_EMAIL|
    Authentication "forgot username": user was not found.`);

// *****************************************************************************
// Authentication "forgot password" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.FORGOT_USERNAME.GENERAL|
    Authentication "forgot password": an unexpected error occurred.`);

// *****************************************************************************

})();