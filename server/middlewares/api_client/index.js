const config = require('../../config/environment');

const internalFn = {
  callback(resolve, data, response) {
    response = response || {statusCode: 0};
    response.data = data;
    resolve(response);
  }
};

function ApiClient(credentials, clientCookie, serverUrl) {
  this.clientCookie = clientCookie;
  this.credentials = credentials;
  this.serverUrl = serverUrl;
}

require('./auth')(ApiClient, internalFn);
require('./contents')(ApiClient, internalFn);
require('./user')(ApiClient, internalFn);

module.exports.ApiClient = ApiClient;

module.exports.middleware = function () {
  return function (req, res, next) {
    const credentials = {
      [config.tokenHeader]: req.cookies[config.tokenCookieName] || ''
    };
    req.api = new ApiClient(credentials, req.headers.cookie || '', config.internalApiServerUrl);
    next();
  };
};
