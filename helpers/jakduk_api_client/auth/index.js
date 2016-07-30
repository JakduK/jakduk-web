'use strict';

var rest = require('restler');
var querystring = require('querystring');

module.exports = function(ApiClient, internalFn) {
  var callback = internalFn.callback;

  ApiClient.prototype.join = function(data) {
    return new Promise(function(resolve) {
      rest.postJson(this.serverUrl + '/user', data).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.joinWith = function(data) {
    return new Promise(function(resolve) {
      rest.postJson(this.serverUrl + '/user/social', data, {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.login = function(username, password) {
    return new Promise(function(resolve) {
      rest.postJson(this.serverUrl + '/login', {
        username: username,
        password: password
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.loginWith = function(provider, accessToken) {
    return new Promise(function(resolve) {
      rest.postJson(this.serverUrl + '/login/social/' + provider, {
        accessToken: accessToken
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.socialAttempted = function() {
    return new Promise(function(resolve) {
      rest.get(this.serverUrl + '/social/attempted', {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.logout = function() {
    return new Promise(function(resolve) {
      rest.get(this.serverUrl + '/logout', {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.findPassword = function(email, callbackUrl) {
    return new Promise(function(resolve) {
      rest.postJson(this.serverUrl + '/password/find', null, {
        query: {
          email: email,
          callbackUrl: callbackUrl
        }
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.checkResetPasswordCode = function(code) {
    return new Promise(function(resolve) {
      rest.get(this.serverUrl + '/password/reset/' + querystring.escape(code))
        .on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.resetPassword = function(code, newPwd) {
    return new Promise(function(resolve) {
      rest.post(this.serverUrl + '/password/reset', {
        data: {
          password: newPwd,
          code: code
        }
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };
};
