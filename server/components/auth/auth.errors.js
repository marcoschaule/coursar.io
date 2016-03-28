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

setError(`500|ERRORS.AUTH.FORGOT_PASSWORD.GENERAL|
    Authentication "forgot password": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.FORGOT_PASSWORD.FIND_USER|
    Authentication "forgot password": error with finding user.`);

setError(`500|ERRORS.AUTH.FORGOT_PASSWORD.USER_NOT_FOUND|
    Authentication "forgot password": user not found.`);

setError(`500|ERRORS.AUTH.FORGOT_PASSWORD.SET_REDIS_ENTRY|
    Authentication "forgot password": error with setting Redis entry.`);

setError(`500|ERRORS.AUTH.FORGOT_PASSWORD.SEND_EMAIL|
    Authentication "forgot password": error with sending email.`);

// *****************************************************************************
// Authentication "reset password" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.RESET_PASSWORD.GENERAL|
    Authentication "reset password": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.RESET_PASSWORD.GET_REDIS_ENTRY|
    Authentication "reset password": error with getting Redis entry.`);

setError(`500|ERRORS.AUTH.RESET_PASSWORD.UPDATE_USER|
    Authentication "reset password": error with updating user.`);

setError(`500|ERRORS.AUTH.RESET_PASSWORD.DELETE_REDIS_ENTRY|
    Authentication "reset password": error with deleting Redis entry.`);

// *****************************************************************************
// Authentication "check signed in" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.CHECK_SIGNED_IN.GENERAL|
    Authentication "check signed in": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.CHECK_SIGNED_IN.USER_AGENT_DIFFERENT|
    Authentication "check signed in": the current user agent is different from what it should be.`);

setError(`500|ERRORS.AUTH.CHECK_SIGNED_IN.USER_IP_DIFFERENT|
    Authentication "check signed in": the current user IP is different from what it should be.`);

setError(`500|ERRORS.AUTH.CHECK_SIGNED_IN.SESSION_NOT_VALID_ANYMORE|
    Authentication "check signed in": the session is not valid anymore.`);

setError(`401|ERRORS.AUTH.CHECK_SIGNED_IN.NOT_SIGNED_IN|
    Authentication "check signed in": the user is not signed in (anymore).`);

setError(`500|ERRORS.AUTH.CHECK_SIGNED_IN.UPDATE_SESSION|
    Authentication "check signed in": error with updating the session.`);

// *****************************************************************************
// Authentication "touch signed in" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.TOUCH_SIGNED_IN.GENERAL|
    Authentication "touch signed in": an unexpected error occurred.`);

setError(`401|ERRORS.AUTH.TOUCH_SIGNED_IN.NOT_SIGNED_IN|
    Authentication "touch signed in": the user is not signed in (anymore).`);

setError(`500|ERRORS.AUTH.TOUCH_SIGNED_IN.JWT_INVALID|
    Authentication "touch signed in": error the JavaScript Web Token.`);

setError(`500|ERRORS.AUTH.TOUCH_SIGNED_IN.UPDATE_SESSION|
    Authentication "touch signed in": error with updating the session.`);

// *****************************************************************************
// Authentication "is username available" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.IS_USERNAME_AVAILABLE.GENERAL|
    Authentication "is username available": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.IS_USERNAME_AVAILABLE.FIND_USER|
    Authentication "is username available": error with finding user.`);

// *****************************************************************************
// Authentication "is email available" errors
// *****************************************************************************

setError(`500|ERRORS.AUTH.IS_EMAIL_AVAILABLE.GENERAL|
    Authentication "is email available": an unexpected error occurred.`);

setError(`500|ERRORS.AUTH.IS_EMAIL_AVAILABLE.FIND_USER|
    Authentication "is email available": error with finding user.`);

// *****************************************************************************

})();