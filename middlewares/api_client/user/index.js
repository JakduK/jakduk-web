'use strict';

var rest = require('restler');

module.exports = function(ApiClient, internalFn) {
  var callback = internalFn.callback;

  ApiClient.prototype.getUserProfile = function() {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/user/profile/me', null, {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this))
  };

  ApiClient.prototype.getUserInfo = function() {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/auth/user', null, {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this))
  };
};