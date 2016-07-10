'use strict';

var rest = require('restler');
var querystring = require('querystring');

function ApiClient(session, serverUrl) {
  this.session = session;
  this.serverUrl = serverUrl;
}

ApiClient.prototype.join = function(data) {
  return new Promise(function(resolve) {
    rest.postJson(this.serverUrl + '/user', data).on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.joinWith = function(data, session) {
  return new Promise(function(resolve) {
    rest.postJson(this.serverUrl + '/user/social', data, {
      headers: {
        Cookie: session
      }
    }).on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.login = function(username, password, remember) {
  return new Promise(function(resolve) {
    rest.post(this.serverUrl + '/login', {
      data: {
        username: username,
        password: password,
        remember_me: remember
      }
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

ApiClient.prototype.socialAttempted = function(session) {
  return new Promise(function(resolve) {
    rest.get(this.serverUrl + '/social/attempted', {
      headers: {
        Cookie: session
      }
    }).on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.logout = function() {
  return new Promise(function(resolve) {
    rest.get(this.serverUrl + '/logout', {
      headers: {
        Cookie: this.session
      }
    }).on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.profile = function() {
  return new Promise(function(resolve) {
    rest.json(this.serverUrl + '/user/profile/me', null, {
      headers: {
        Cookie: this.session
      }
    }).on('complete', callback.bind(null, resolve));
  }.bind(this))
};

ApiClient.prototype.latest = function() {
  return new Promise(function(resolve) {
    rest.json(this.serverUrl + '/home/latest').on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.encyclopedia = function(lang) {
  return new Promise(function(resolve) {
    rest.json(this.serverUrl + '/home/encyclopedia', null, {
      query: {
        lang: lang
      }
    }).on('complete', callback.bind(null, resolve));
  }.bind(this));
};

ApiClient.prototype.footballClubs = function(lang) {
  return new Promise(function(resolve) {
    rest.json(this.serverUrl + '/football/clubs', null, {
      query: {
        lang: lang
      }
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

function callback(resolve, data, response) {
  response.data = data;
  resolve(response);
}

module.exports = ApiClient;
