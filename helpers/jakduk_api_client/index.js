'use strict';

function ApiClient(credentials, clientCookie, serverUrl) {
  this.clientCookie = clientCookie;
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
