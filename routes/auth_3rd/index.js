'use strict';

var express = require('express');
var querystring = require('querystring');
var _ = require('lodash');
var config = require('../../config/environment');
var oauthClient = require('../../helpers/oauth');
var Util = require('../../helpers/jakduk_util');

function oauth2(providers) {
  var router = express.Router();

  _.forEach(providers, function(provider) {
    router.get('/' + provider, login.bind(null, provider));
    router.get('/' + provider + '/callback', callback.bind(null, provider));
  });

  return router;
}

function login(provider, req, res) {
  res.redirect(oauthClient[provider].getLoginUrl() + '&state=' + querystring.escape('redir=' + (req.query.redir || '')));
}

function callback(provider, req, res) {
  oauthClient[provider].authorize(req.query.code).then(function (response) {
    if (response.statusCode === 200) {
      return req.api.loginWith(provider, response.data.access_token);
    }
  }).then(function (response) {
    var extra = querystring.parse(req.query.state);
    var status = response.statusCode;

    if (status === 200) {
      Util.saveSession(res, response.headers[config.tokenHeader]);
      res.redirect(extra.redir || '/');
    } else if (status === 404) {
      Util.saveSession(res, response.headers[config.tempTokenHeader] || '');
      Util.redirect('/join/oauth', extra.redir, res);
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
