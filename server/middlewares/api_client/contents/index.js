module.exports = function (ApiClient) {
  ApiClient.prototype.latest = function () {
    return this.requestGetJson(`${this.serverUrl}/home/latest`);
  };

  ApiClient.prototype.encyclopedia = function (lang) {
    return this.requestGetJson(`${this.serverUrl}/home/encyclopedia`, {
      query: {
        lang: lang
      }
    });
  };

  ApiClient.prototype.footballClubs = function (lang) {
    return this.requestGetJson(`${this.serverUrl}/football/clubs`, {
      query: {
        lang: lang.replace('-', '_')
      }
    });
  };

  ApiClient.prototype.getTopPosts = function () {
    return this.requestGetJson(`${this.serverUrl}/board/free/tops`);
  };

  ApiClient.prototype.getPosts = function (query) {
    return this.requestGetJson(`${this.serverUrl}/board/free/posts`, {
      query: query
    });
  };

  ApiClient.prototype.getPost = function (seq) {
    return this.requestGetJson(`${this.serverUrl}/board/free/${seq}`);
  };

  ApiClient.prototype.getComments = function (query) {
    return this.requestGetJson(`${this.serverUrl}/board/free/comments`, {
      query: query
    });
  };

  ApiClient.prototype.getComment = function (seq) {
    return this.requestGetJson(`${this.serverUrl}/board/free/comments/${seq}`);
  };

  ApiClient.prototype.getBoardCategories = function (lang) {
    return this.requestGetJson(`${this.serverUrl}/board/free/categories`, {
      query: {
        lang: lang
      }
    });
  };

  ApiClient.prototype.getGalleryItem = function (id) {
    return this.requestGetJson(`${this.serverUrl}/gallery/${id}`);
  };

  ApiClient.prototype.search = function (query) {
    return this.requestGetJson(`${this.serverUrl}/search`, {
      query: query
    });
  };

  ApiClient.prototype.getPopularSearchWords = function (query) {
    return this.requestGetJson(`${this.serverUrl}/search/popular/words`, {
      query: query
    });
  };

  ApiClient.prototype.rss = function () {
    return this.requestGetJson(this.serverUrl.replace(/\/api$/, '/rss'));
  };

  ApiClient.prototype.sitemap = function () {
    return this.requestGet(this.serverUrl.replace(/\/api$/, '/sitemap.xml'));
  };
};
