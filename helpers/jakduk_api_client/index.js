'use strict';

var config = require('../../config/environment');

function ApiClient(credentials, serverUrl) {
  this.credentials = credentials;
  this.serverUrl = serverUrl;
}

var internalFn = {
  callback: function(resolve, data, response) {
    response = response || {statusCode: 0};
    response.data = data;
    resolve(response);
  }
};

require('./auth')(ApiClient, internalFn);
require('./contents')(ApiClient, internalFn);
require('./user')(ApiClient, internalFn);

module.exports = ApiClient;
