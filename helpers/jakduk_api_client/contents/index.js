'use strict';

var rest = require('restler');
var querystring = require('querystring');

module.exports = function(ApiClient, internalFn) {
  var callback = internalFn.callback;

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

  ApiClient.prototype.getTopPosts = function() {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/tops').on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getPosts = function(query) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/posts', null, {
        query: query
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getPost = function(seq) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/' + seq, null, {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getComments = function(query) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/comments', null, {
        query: query
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getBoardCategories = function(lang) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/categories', null, {
        query: {
          lang: lang
        }
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getGalleryItem = function(id) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/gallery/' + id, null, {
        headers: this.credentials
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };
};
