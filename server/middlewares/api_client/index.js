const config = require('../../config/environment');
const restler = require('restler');
const _ = require('lodash');

function ApiClient(clientCookie, serverUrl) {
  this.clientCookie = clientCookie;
  this.serverUrl = serverUrl;
}

ApiClient.prototype.request = function (url, options) {
  return new Promise(resolve => {
    options = _.merge({
      headers: {Cookie: this.clientCookie}
    }, options);

    restler.request(url, options).on('complete', (data, response) => {
      response = response || {statusCode: 0};
      response.data = data;
      resolve(response);
    });
  });
};

ApiClient.prototype.requestGet = function (url, options) {
  options = _.merge({method: 'GET'}, options);
  return this.request(url, options);
};

ApiClient.prototype.requestPost = function (url, options) {
  options = _.merge({method: 'POST'}, options);
  return this.request(url, options);
};

ApiClient.prototype.requestGetJson = function (url, options) {
  options = _.merge({
    method: 'GET',
    headers: {'content-type': 'application/json'},
    parser: restler.parsers.json
  }, options);
  options.data = JSON.stringify(options.data);
  return this.request(url, options);
};

ApiClient.prototype.requestPostJson = function (url, options) {
  options = _.merge({
    method: 'POST',
    headers: {'content-type': 'application/json'},
    parser: restler.parsers.json
  }, options);
  options.data = JSON.stringify(options.data);
  return this.request(url, options);
};

require('./auth')(ApiClient);
require('./contents')(ApiClient);
require('./user')(ApiClient);

module.exports.ApiClient = ApiClient;

module.exports.middleware = function () {
  return function (req, res, next) {
    req.api = new ApiClient(req.headers.cookie || '', config.internalApiServerUrl);
    next();
  };
};
