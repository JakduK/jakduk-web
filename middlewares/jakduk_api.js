'use strict';

var _ = require('lodash');
var Client = require('node-rest-client').Client;
var rest = new Client();

function Api(session, serverUrl) {
  this.session = session || '';
  this.serverUrl = serverUrl;
}

Api.prototype.join = function(data, callback) {
  return rest.post(this.serverUrl + '/user', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      'email': data.email,
      'username': data.username,
      'password': data.password,
      'passwordConfirm': data.passwordConfirm,
      'footballClub': data.footballClub,
      'about': data.about
    }
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

Api.prototype.footballClubs = function(lang, callback) {
  return rest.get(this.serverUrl + '/football/clubs', {
    parameters: {lang: lang}
  }, callback);
};

Api.prototype.findPassword = function(email, callbackUrl) {
  return new Promise(function(resolve) {
    rest.post(this.serverUrl + '/password/find', {
      parameters: {
        email: email,
        callbackUrl: callbackUrl
      }
    }, callback.bind(null, resolve));
  }.bind(this));
};

Api.prototype.checkResetPasswordCode = function(code) {
  return new Promise(function(resolve) {
    rest.get(this.serverUrl + '/password/reset/${code}', {
      path: {code: code}
    }, callback.bind(null, resolve));
  }.bind(this));
};

Api.prototype.resetPassword = function(code, newPwd) {
  return new Promise(function(resolve) {
    rest.post(this.serverUrl + '/password/reset', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: [
        'password=' + encodeURIComponent(newPwd),
        'code=' + encodeURIComponent(code)
      ].join('&')
    }, callback.bind(null, resolve));
  }.bind(this));
};

function callback(resolve, data, response) {
  response.data = data;
  resolve(response);
}

module.exports = Api;