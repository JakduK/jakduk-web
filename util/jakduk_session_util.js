var _ = require('lodash');
var cookie = require('cookie');

module.exports = {
  saveSession: function (res, apiResponse) {
    var sessionCookie = _.find(apiResponse.headers['set-cookie'], function (value) {
      return value.indexOf('JSESSIONID') !== -1;
    });

    var cookieObj = cookie.parse(sessionCookie);
    res.cookie('JSESSIONID', cookieObj.JSESSIONID, cookieObj);
  },
  clearSession: function(res) {
    res.clearCookie('JSESSIONID');
  }
};