(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

// *****************************************************************************
// Library functions
// *****************************************************************************

/**
 * Library function to get the current operating system.
 *
 * @public
 * @param  {String} strUserAgent  string of the current user agent
 * @return {Object}               object of the collection of OS information
 */
function getOperationSystem(strUserAgent) {
    var objOS = {};

    if (/mobile/i.test(strUserAgent)){
        objOS.Mobile = true;
    }
    if (/like Mac OS X/.test(strUserAgent)) {
        objOS.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(strUserAgent)[2].replace(/_/g, '.');
        objOS.iPhone = /iPhone/.test(strUserAgent);
        objOS.iPad = /iPad/.test(strUserAgent);
    }
    if (/Android/.test(strUserAgent)){
        objOS.Android = /Android ([0-9\.]+)[\);]/.exec(strUserAgent)[1];
    }
    if (/webOS\//.test(strUserAgent)){
        objOS.webOS = /webOS\/([0-9\.]+)[\);]/.exec(strUserAgent)[1];
    }
    if (/(Intel|PPC) Mac OS X/.test(strUserAgent)){
        objOS.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(strUserAgent)[2].replace(/_/g, '.') || true;
    }
    if (/Windows NT/.test(strUserAgent)){
        objOS.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(strUserAgent)[1];
    }

    return objOS;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.getOperationSystem = getOperationSystem;

// *****************************************************************************

})();
