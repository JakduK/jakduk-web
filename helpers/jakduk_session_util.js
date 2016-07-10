var _ = require('lodash');
var cookie = require('cookie');

module.exports = {
  saveSession: function (res, apiResponse) {
    var session = apiResponse.headers['set-cookie'];
    res.append('Set-Cookie', session);
  },
  clearSession: function(res) {
    res.clearCookie('JSESSIONID');
    res.clearCookie('rememeber-me');
  }
};