'use strict';

function ApiClient(session, serverUrl) {
  this.session = session;
  this.serverUrl = serverUrl;
}

ApiClient.prototype._callback = function(resolve, data, response) {
  response.data = data;
  resolve(response);
};

require('./auth')(ApiClient);
require('./contents')(ApiClient);
require('./user')(ApiClient);

module.exports = ApiClient;
