'use strict';

var _ = require('lodash');
var Client = require('node-rest-client').Client;
var rest = new Client();

function Api(session, serverUrl) {
  this.session = session || '';
  this.serverUrl = serverUrl;
}

Api.prototype.join = function(data, callback) {
  return rest.get(this.serverUrl + '/join', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: [
      'username=' + encodeURIComponent(data.username),
      'password=' + encodeURIComponent(data.password)
    ].join('&')
  }, callback);
};

Api.prototype.login = function(data, callback) {
  return rest.post(this.serverUrl + '/login', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: [
      'username=' + encodeURIComponent(data.username),
      'password=' + encodeURIComponent(data.password)
    ].join('&')
  }, callback);
};

Api.prototype.logout = function(callback) {
  return rest.get(this.serverUrl + '/logout', {
    headers: {
      cookie: this.session
    }
  }, callback);
};

Api.prototype.profile = function(callback) {
  return rest.get(this.serverUrl + '/user/profile/me', {
    headers: {
      cookie: this.session
    }
  }, callback);
};

Api.prototype.latest = function(callback) {
  return rest.get(this.serverUrl + '/home/latest', callback);
};

Api.prototype.encyclopedia = function(lang, callback) {
  return rest.get(this.serverUrl + '/home/encyclopedia', {
    parameters: {lang: lang}
  }, callback);
};

module.exports = Api;