(function() { 'use strict';

// *****************************************************************************
// Includes and definitions
// *****************************************************************************

var path         = require('path');
var assert       = require('chai').assert;
var sinon        = require('sinon');
var proxyquire   = require('proxyquire').noCallThru();

var strAuthPath  = path.join(_getBasedir(), '/server/components/auth/');
var AuthCtrlStub = require('./auth.controller.stub.js');
var AuthRoutes   = proxyquire(path.join(strAuthPath, '/auth.routes.js'),
        { './auth.controller.js': AuthCtrlStub });

// *****************************************************************************
// Spec definitions
// *****************************************************************************

describe('Authentication route\'s', function() {

    describe('"init" function', function () {
        var objResult;

        beforeEach(function() {
            objResult = AuthRoutes.init();
        });
        it('* should return an object containing the functions "public"', function () {
            assert.isDefined(objResult.public);
            assert.typeOf(objResult.public, 'function');
        });
        it('* should return an object containing the functions "authorize"', function () {
            assert.isDefined(objResult.authorize);
            assert.typeOf(objResult.authorize, 'function');
        });
    });

    describe('"setPublicRoutes" function', function () {
        var objApp = {};
        var objResult;

        beforeEach(function() {
            objApp.put = sinon.spy();
            objResult  = AuthRoutes.init(objApp);
            objResult.public();
        });
        it('* should create a route for sign in', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/sign-in', AuthCtrlStub.signIn));
        });
        it('* should create a route for sign up', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/sign-up', AuthCtrlStub.signUp));
        });
        it('* should create a route for sign out', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/sign-out', AuthCtrlStub.signOut));
        });
        it('* should create a route for forgotten username', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/forgot-username', AuthCtrlStub.forgotUsername));
        });
        it('* should create a route for forgotten password', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/forgot-password', AuthCtrlStub.forgotPassword));
        });
        it('* should create a route for resetting password', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/reset-password', AuthCtrlStub.resetPassword));
        });
        it('* should create a route for testing if email or username is available', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/is-available', AuthCtrlStub.isAvailable));
        });
        it('* should create a route for testing if user is signed in', function () {
            assert.isTrue(objApp.put.called);
            assert.isTrue(objApp.put.calledWith('/is-signed-in', AuthCtrlStub.isSignedIn));
        });
    });

    describe('"setAuthorization" function', function () {
        var objApp = {};
        var objResult;

        beforeEach(function() {
            objApp.use = sinon.spy();
            objResult  = AuthRoutes.init(objApp);
            objResult.authorize();
        });
        it('* should create a middleware for authorizing users', function () {
            assert.isTrue(objApp.use.called);
            assert.isTrue(objApp.use.calledWith(AuthCtrlStub.authorize));
        });
    });
});


// *****************************************************************************

})();