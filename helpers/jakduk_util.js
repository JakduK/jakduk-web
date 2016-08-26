'use strict';

var querystring = require('querystring');
var config = require('../config/environment');

module.exports = {
  saveSession: function (res, token, remember) {
    var options = {httpOnly: true};
    if (remember) {
      options.maxAge = config.tokenMaxAge;
    }
    res.cookie(config.tokenCookieName, token, options);
  },
  clearSession: function(res) {
    res.clearCookie(config.tokenCookieName);
  },
  redirect: function (target, callbackUrl, res) {
    res.redirect(target + '?redir=' + querystring.escape(callbackUrl));
  }
};