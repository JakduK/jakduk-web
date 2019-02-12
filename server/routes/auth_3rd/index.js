const express = require('express');
const querystring = require('querystring');
const _ = require('lodash');
const oauthClient = require('../../helpers/oauth');
const Util = require('../../helpers/jakduk_util');
const debug = require('debug')('jakduk-web:auth_3rd');

function oauth2(providers) {
  const router = express.Router();

  _.forEach(providers, provider => {
    router.get(`/${provider}`, login.bind(null, provider));
    router.get(`/${provider}/callback`, callback.bind(null, provider));
    router.post(`/${provider}/callback`, callback.bind(null, provider));
  });

  return router;
}

function login(provider, req, res) {
  const providerLoginUrl = oauthClient[provider].getLoginUrl();
  res.redirect(`${providerLoginUrl}&state=${querystring.escape(`redir=${(req.query.redir || '')}`)}`);
}

function callback(provider, req, res, next) {
  oauthClient[provider].authorize(req.query.code || req.body).then(response => {
    if (response.statusCode === 200 || response.status === 200) {
      debug(`[Login with ${provider}] %o`, response.data);
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

    if (status === 200 && accessToken) {
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
  }).catch((response) => {
    if (response.statusCode === 500) {
      next({
        status: response.statusCode,
        message: JSON.stringify(response.data, null, 2)
      });
    } else {
      res.redirect('/login');
    }
  });
}

module.exports.setup = function (app) {
  app.use('/auth', oauth2([
    'google',
    'facebook',
    'naver',
    'kakao',
  ]));
};
