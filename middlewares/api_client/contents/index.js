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
        headers: {
          Cookie: this.clientCookie
        }
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

  ApiClient.prototype.getComment = function(seq) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/board/free/comments/' + seq).on('complete', callback.bind(null, resolve));
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
        headers: {
          Cookie: this.clientCookie
        }
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.search = function(query) {
    return new Promise(function(resolve) {
      rest.json(this.serverUrl + '/search', null, {
        query: query
      }).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };

  ApiClient.prototype.getPopularSearchWords = function () {
    return new Promise(resolve => {
      rest.json(`${this.serverUrl}/search/popular/words`).on('complete', callback.bind(null, resolve));
    });
  };

  ApiClient.prototype.rss = function() {
    return new Promise(function(resolve) {
      rest.get(this.serverUrl.replace(/\/api$/, '/rss')).on('complete', callback.bind(null, resolve));
    }.bind(this));
  };
};
