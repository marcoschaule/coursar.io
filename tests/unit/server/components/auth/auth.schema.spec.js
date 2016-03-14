(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************


var path    = require('path');
var assert  = require('chai').assert;
var sinon   = require('sinon');
var bequire = require('proxyquire').noCallThru();

var MockMongoose = require(path.join(_getBasedir(), '/tests/unit/_mocks/mongoose.mock.js'));
var AuthSchema   = bequire(path.join(path.join(_getBasedir(), '/server/components/auth/'), '/auth.schema.js'),
        { 'mongoose': MockMongoose.mongoose });

// *****************************************************************************
// Spec definitions
// *****************************************************************************

describe('Authentication schema\'s', function() {
    describe('authentication object', function () {
        it('* should have a "profile" sub-object with user fields', function () {
            var profile = MockMongoose.objSrc().profile;
            assert.isDefined(profile);
            assert.isDefined(profile.dateOfBirth);
            assert.isDefined(profile.gender);
            assert.isDefined(profile.name);
            assert.isDefined(profile.name.first);
            assert.isDefined(profile.name.last);
            assert.isDefined(profile.address);
            assert.isDefined(profile.address.street);
            assert.isDefined(profile.address.city);
            assert.isDefined(profile.address.zipcode);
        });
        it('* should have a "emails" sub-array with email fields', function () {
            var emails = MockMongoose.objSrc().emails;
            var email  = emails[0];
            assert.isDefined(emails);
            assert.isDefined(email.address);
            assert.isDefined(email.address.validate);
            assert.isDefined(email.address.validate.validator);
            assert.isDefined(email.address.validate.message);
            assert.isDefined(email.isVerified);
            assert.isDefined(email.isVerified.default);
            assert.equal(email.isVerified.default, false);
        });
        it('* should have a "isAdmin" sub-field', function () {
            var isAdmin = MockMongoose.objSrc().isAdmin;
            assert.isDefined(isAdmin);
            assert.isDefined(isAdmin.default);
            assert.equal(isAdmin.default, false);
        });
        it('* should have a "username" sub-field', function () {
            var username = MockMongoose.objSrc().username;
            assert.isDefined(username);
            assert.isDefined(username.min);
            assert.isDefined(username.max);
            assert.isDefined(username.required);
            assert.equal(username.required, true);
        });
        it('* should have a "password" sub-object with "salt" and "hash" fields', function () {
            var password = MockMongoose.objSrc().password;
            assert.isDefined(password);
            assert.isDefined(password.salt);
            assert.isDefined(password.salt.required);
            assert.isDefined(password.hash);
            assert.isDefined(password.hash.required);
            assert.equal(password.salt.required, true);
            assert.equal(password.hash.required, true);
        });
    });

    describe('Schema constructor', function () {
        it('* should have been called with the Auth object and the collection name "users"', function () {
            assert.isTrue(MockMongoose.mongoose.Schema.calledWith(
                    MockMongoose.objSrc()),
                    { collection: 'users' });
        });
    });

    describe('statics and methods objects', function () {
        it('* should have the static "encrypt"', function () {
            assert.isDefined(MockMongoose.statics().encrypt);
            assert.typeOf(MockMongoose.statics().encrypt, 'function');
        });
        it('* should have the methods "encrypt"', function () {
            assert.isDefined(MockMongoose.methods().encrypt);
            assert.typeOf(MockMongoose.methods().encrypt, 'function');
        });
        it('* should have the methods "compare"', function () {
            assert.isDefined(MockMongoose.methods().compare);
            assert.typeOf(MockMongoose.methods().compare, 'function');
        });
    });
    
    describe('mongoose model function', function () {
        it('* should have been called', function() {
            assert.isTrue(MockMongoose.mongoose.model.calledWith(
                    'Auth', sinon.match.object, 'users'))
        });
    });
    
    describe('auth schema\'s virtual function', function () {
        it('* should have been called', function() {
            assert.isTrue(MockMongoose.objGet().get.called)
        });
    });
});


// *****************************************************************************

})();