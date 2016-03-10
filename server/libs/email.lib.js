(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path           = require('path');
var clone          = require('clone');
var nodemailer     = require('nodemailer');

// create transporter object for sending emails
var transporter    = nodemailer.createTransport(settings.general.smtp.uri);
var regexUsername  = new RegExp('\\$\\{username\\}', 'gim');
var regexLink      = new RegExp('\\$\\{link\\}', 'gim');

// email templates
var objTemplateEmailVerifyEmail =
    require('../templates/emails/verify-email.template.json');
var objTemplateEmailForgotUsername =
    require('../templates/emails/forgot-username.template.json');
var objTemplateEmailForgotPassword =
    require('../templates/emails/forgot-password.template.json');

// *****************************************************************************
// Library function definitions
// *****************************************************************************

/**
 * Library function to send and email in the "verify email" process.
 * @public
 * 
 * @param {String}   strEmail  string address the email is send to
 * @param {String}   strRId    string if the Redis ID
 * @param {Function} callback  function for callback
 */
function sendEmailVerifyEmail(strEmail, strRId, callback) {
    return _sendEmailForVerifyEmailOrForgotPassword(
            'verify-email', strEmail, strRId, callback);
}

// *****************************************************************************

/**
 * Library function to send and email in the "forget password" process.
 * @public
 * 
 * @param {String}   strEmail     string address the email is send to
 * @param {String}   strUsername  string of username to be replaced
 * @param {Function} callback     function for callback
 */
function sendEmailForgotUsername(strEmail, strUsername, callback) {
    return _sendEmailForForgotUsername(
            strEmail, strUsername, callback);
}

// *****************************************************************************

/**
 * Library function to send and email in the "forget password" process.
 * @public
 * 
 * @param {String}   strEmail  string address the email is send to
 * @param {String}   strRId    string if the Redis ID
 * @param {Function} callback  function for callback
 */
function sendEmailForgotPassword(strEmail, strRId, callback) {
    return _sendEmailForVerifyEmailOrForgotPassword(
            'reset-password', strEmail, strRId, callback);
}

// *****************************************************************************
// Helper function definitions
// *****************************************************************************

/**
 * Helper function to send an email in case of "forgot username" scenario.
 * 
 * @param {String}   strEmail     string address the email is send to
 * @param {String}   strUsername  string of username to be replaced
 * @param {Function} callback     function for callback
 */
function _sendEmailForForgotUsername(strEmail, strUsername, callback) {
    var objMailOptions;

    if (!callback || 'function' !== typeof callback) {
        callback = function() {};
    }

    objMailOptions      = clone(objTemplateEmailForgotUsername);
    objMailOptions.to   = strEmail;
    objMailOptions.text = objMailOptions.text.replace(regexUsername, strUsername);
    objMailOptions.html = objMailOptions.html.replace(regexUsername, strUsername);

    // send mail with defined transport object
    return transporter.sendMail(objMailOptions, (objErr, objReply) => 
        callback(objErr, objReply && objReply.repsonse));
}

// *****************************************************************************

/**
 * Helper function to send an email in general.
 * @private
 * 
 * @param {String}   strUrlPart  string of the URL party that is called with the Redis ID
 * @param {String}   strEmail    string address the email is send to
 * @param {String}   strRId      string if the Redis ID
 * @param {Function} callback    function for callback
 */
function _sendEmailForVerifyEmailOrForgotPassword(
        strUrlPart, strEmail, strRId, callback) {
    var strLink, objMailOptions;

    if (!callback || 'function' !== typeof callback) {
        callback = function() {};
    }

    strLink             = path.join(settings.general.system.url, strUrlPart, strRId);
    objMailOptions      = clone(objTemplateEmailForgotPassword);
    objMailOptions.to   = strEmail;
    objMailOptions.text = objMailOptions.text.replace(regexLink, strLink);
    objMailOptions.html = objMailOptions.html.replace(regexLink, strLink);

    // send mail with defined transport object
    return transporter.sendMail(objMailOptions, (objErr, objReply) => 
        callback(objErr, objReply && objReply.repsonse));
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.sendEmailVerifyEmail    = sendEmailVerifyEmail;
module.exports.sendEmailForgotUsername = sendEmailForgotUsername;
module.exports.sendEmailForgotPassword = sendEmailForgotPassword;

// *****************************************************************************

})();