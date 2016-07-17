'use strict';

var express = require('express');
var querystring = require('querystring');
var _ = require('lodash');
var config = require('../../config/environment');
var oauthClient = require('../../helpers/oauth');
var SessionUtil = require('../../helpers/jakduk_session_util');

function oauth2(providers) {
  var router = express.Router();

  _.forEach(providers, function(provider) {
    router.get('/' + provider, login.bind(null, provider));
    router.get('/' + provider + '/callback', callback.bind(null, provider));
  });

  return router;
}

function login(provider, req, res) {
  res.redirect(oauthClient[provider].getLoginUrl() + '&state=' + querystring.escape('redir=' + req.headers.referer));
}

function callback(provider, req, res) {
  oauthClient[provider].authorize(req.query.code).then(function (response) {
    if (response.statusCode === 200) {
      return req.api.loginWith(provider, response.data.access_token);
    }
  }).then(function (response) {
    var status = response.statusCode;
    if (status === 200) {
      var extra = querystring.parse(querystring.decode(req.query.state));
      SessionUtil.saveSession(res, response);
      res.redirect(extra.redir || '/');
    } else if (status === 404) {
      SessionUtil.saveSession(res, response);
      res.redirect('/join/oauth');
    } else {
      return Promise.reject();
    }
  }).catch(function () {
    res.redirect('/login');
  });
}

module.exports.setup = function (app) {
  app.use('/auth', oauth2([
    'daum',
    'facebook'
  ]));
};
