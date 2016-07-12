'use strict';

var rest = require('restler');
var querystring = require('querystring');

module.exports = function(ApiClient) {
  var callback = ApiClient.prototype._callback;

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

  ApiClient.prototype.topPosts = function() {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/tops').on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.posts = function(query) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/posts', null, {
        query: query
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };
};