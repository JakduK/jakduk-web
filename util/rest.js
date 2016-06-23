var _ = require('lodash');
var config = require('../config/environment');
var Client = require('node-rest-client').Client;

var rest = new Client();
rest.registerMethod('login', config.apiServerUrl + '/login', 'post');
rest.registerMethod('join', config.apiServerUrl + '/login', 'post');
rest.registerMethod('userInfo', config.apiServerUrl + '/user/my/profile', 'get');
rest.registerMethod('latest', config.apiServerUrl + '/home/latest', 'get');
rest.registerMethod('encyclopedia', config.apiServerUrl + '/home/encyclopedia', 'get');

module.exports = {
  userInfo: rest.methods.userInfo,
  latest: rest.methods.latest,
  encyclopedia: rest.methods.encyclopedia,
  login: function(data, callback) {
    return rest.methods.login(_.merge({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, data), callback)
  },
  join: rest.methods.join
};