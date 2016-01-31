(function() { 'use strict';

// *****************************************************************************
// Requires and definitions
// *****************************************************************************

var Auth        = require('./auth.schema.js').Auth;
var AuthService = require('./auth.service.js');

// *****************************************************************************
// Controller functions
// *****************************************************************************

/**
 * Controller function to sign in a user.
 * 
 * @param {Object}   req                  object of Express request
 * @param {Object}   req.body             object of request body
 * @param {Object}   req.body.username    string of new user's username
 * @param {Object}   req.body.password    string of new user's password
 * @param {Boolean}  req.body.isReminded  true if user wants to be reminded
 * @param {Object}   res                  object of Express response
 * @param {Function} next                 function of callback for next middleware
 */
function signIn(req, res, next) {

    // create user object
    var objAuth = {
        username  : req.body.username,
        password  : req.body.password,
        isReminded: !!req.body.isReminded,
    };

    return AuthService.signIn(objAuth, (objErr, objUser, strAccessToken) => {
        if (objErr) {
            return res.status(objErr.status || 500).json({ err: objErr });
        }

        var objReturn = {
            err        : null,
            user       : objUser,
            accessToken: strAccessToken };

        return res.status(200).json(objReturn);
    });
}

// // *****************************************************************************

// /**
//  * Controller function to sign in a user.
//  * 
//  * @param {Object}   req                object of Express request
//  * @param {Object}   req.body           object of request body
//  * @param {Object}   req.body.email     string of new user's email
//  * @param {Object}   req.body.username  string of new user's username
//  * @param {Object}   req.body.password  string of new user's password
//  * @param {Object}   res                object of Express response
//  * @param {Function} next               function of callback for next middleware
//  */
// function signUp(req, res, next) {

//     // create user object
//     var objUser = new User({
//         email   : req.body.email,
//         username: req.body.username,
//         password: req.body.password,
//     });

//     // validate user data
//     // -- validation --

//     return User.register(objUser, objUser.password, (err, objUserResult) => {
//         if (err) {
//             return next(err);
//         }

//         // delete unnecessary email
//         if (objUser.email) {
//             delete objUser.email;
//         }

//         // sign in user
//         return req.login(objUser, (err) => {
//             if (err) {
//                 return next(err);
//             }

//             return res.status(200).json({ user: req.user });
//         });
//     });
// }

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.signIn = signIn;
// module.exports.signUp = signUp;

// *****************************************************************************
// Helpers
// *****************************************************************************
    
// *****************************************************************************

})();