const querystring = require('querystring');
const express = require('express');
const i18n = require('i18n');
const Util = require('../../helpers/jakduk_util');
const config = require('../../config/environment');

function index(req, res, next) {
  req.api.footballClubs(req.locale).then(response => {
    const footballClubs = response.data;

    res.render('login/join', {
      title: [
        i18n.__('user.register'),
        i18n.__('common.jakduk')
      ],
      footballClubs: footballClubs,
      redir: `?redir=${querystring.escape(req.query.redir || '')}`,
      bySocialAccount: false
    });
  }).catch(next);
}

function submit(req, res, next) {
  const body = req.body;

  req.api.join({
    email: body.email,
    username: body.username,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    footballClub: body.footballClub,
    about: body.about
  }).then(response => {
    if (response.statusCode === 200) {
      Util.saveSession(res, response);
      res.redirect(req.query.redir || '/');
    } else {
      res.render('login/join', {
        title: [
          i18n.__('user.register'),
          i18n.__('common.jakduk')
        ]
      });
    }
  }).catch(next);
}

function indexOAuth(req, res, next) {
  Promise.all([
    req.api.socialAttempt(),
    req.api.footballClubs(req.locale)
  ]).then(responses => {
    if (responses[0].statusCode !== 200) {
      res.redirect('/login');
      return;
    }

    const snsProfile = responses[0].data;
    const footballClubs = responses[1].data;

    Util.saveSession(res, req.cookies[config.tokenCookieName]);

    res.render('login/join', {
      title: [
        i18n.__('user.register'),
        i18n.__('common.jakduk')
      ],
      footballClubs: footballClubs,
      redir: `?redir=${querystring.escape(req.query.redir || '')}`,
      bySocialAccount: true,
      snsProfile: snsProfile,
      provider: req.query.provider,
      accessToken: req.query.accessToken
    });
  }).catch(next);
}

function submitOAuth(req, res, next) {
  const body = req.body;

  res.clearCookie(config.tempTokenCookieFlag);

  req.api.joinWith({
    email: body.email,
    username: body.username,
    footballClub: body.footballClub,
    about: body.about
  }).then(response => {
    if (response.statusCode === 200) {
      req.api.loginWith(body.provider, body.accessToken).then(() => {
        res.redirect(req.query.redir || '/');
      });
    } else {
      res.redirect('/login');
    }
  }).catch(next);
}

module.exports.setup = function (app) {
  const router = express.Router();

  router.use('/', (req, res, next) => {
    if (req.isAuthenticated) {
      res.redirect('back');
      return;
    }
    next();
  });

  router.get('/', index);
  router.post('/', submit);

  router.get('/oauth', indexOAuth);
  router.post('/oauth', submitOAuth);

  app.use('/join', router);
};
