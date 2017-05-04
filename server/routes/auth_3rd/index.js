const express = require('express');
const querystring = require('querystring');
const _ = require('lodash');
const oauthClient = require('../../helpers/oauth');
const Util = require('../../helpers/jakduk_util');

function oauth2(providers) {
  const router = express.Router();

  _.forEach(providers, provider => {
    router.get(`/${provider}`, login.bind(null, provider));
    router.get(`/${provider}/callback`, callback.bind(null, provider));
  });

  return router;
}

function login(provider, req, res) {
  res.redirect(`${oauthClient[provider].getLoginUrl()}&state=${querystring.escape(`redir=${(req.query.redir || '')}`)}`);
}

function callback(provider, req, res) {
  oauthClient[provider].authorize(req.query.code).then(response => {
    if (response.statusCode === 200) {
      return Promise.all([
        response.data.access_token,
        req.api.loginWith(provider, response.data.access_token)
      ]);
    }
  }).then(responses => {
    const extra = querystring.parse(req.query.state);
    const status = responses[1].statusCode;
    const accessToken = responses[0];
    const loginResponse = responses[1];

    if (status === 200) {
      Util.saveSession(res, loginResponse);
      res.redirect(extra.redir || '/');
    } else if (status === 404) {
      Util.saveSession(res, loginResponse, true);
      Util.redirect(res, {
        target: '/join/oauth',
        query: {
          redir: extra.redir,
          provider: provider,
          accessToken: accessToken
        }
      });
    } else {
      return Promise.reject(loginResponse);
    }
  }).catch(() => {
    res.redirect('/login');
  });
}

module.exports.setup = function (app) {
  app.use('/auth', oauth2([
    'daum',
    'facebook'
  ]));
};
