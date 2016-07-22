'use strict';

var express = require('express');
var i18n = require('i18n');
var SessionUtil = require('../../helpers/jakduk_session_util');

function index(req, res) {
  req.api.footballClubs(req.locale).then(function (response) {
    var footballClubs = response.data;
    res.render('login/join', {
      title: [
        i18n.__('user.register'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_join',
      footballClubs: footballClubs,
      redir: req.headers.referer,
      isEmailSignup: true
    });
  });
}

function submit(req, res) {
  var body = req.body;
  req.api.join({
    email: body.email,
    username: body.username,
    password: body.password,
    passwordConfirm: body.passwordConfirm,
    footballClub: body.footballClub,
    about: body.about
  }).then(function (response) {
    if (response.statusCode === 200) {
      SessionUtil.saveSession(res, response);
      res.redirect(body.redir || '/');
    } else {
      res.render('login/join', {
        title: [
          i18n.__('user.register'),
          i18n.__('common.jakduk')
        ],
        headPage: 'head_join'
      });
    }
  });
}

function indexOAuth(req, res) {
  Promise.all([
    req.api.socialAttempted(),
    req.api.footballClubs(req.locale),
  ]).then(function (responses) {
    if (responses[0].statusCode !== 200) {
      res.redirect('/login');
      return;
    }

    var snsProfile = responses[0].data;
    var footballClubs = responses[1].data;
    res.render('login/join', {
      title: [
        i18n.__('user.register'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_join',
      footballClubs: footballClubs,
      redir: req.headers.referer,
      isEmailSignup: false,
      userWrite: snsProfile
    });
  });
}

function submitOAuth(req, res) {
  var body = req.body;
  req.api.joinWith({
    email: body.email,
    username: body.username,
    footballClub: body.footballClub,
    about: body.about
  }, req.headers.cookie).then(function (response) {
    if (response.statusCode === 200) {
      res.redirect(body.redir || '/');
    } else {
      res.render('login/join', {
        title: [
          i18n.__('user.register'),
          i18n.__('common.jakduk')
        ],
        headPage: 'head_login'
      });
    }
  });
}

module.exports.setup = function (app) {
  var router = express.Router();

  router.use('/', function (req, res, next) {
    if (req.isAuthenticated) {
      res.redirect('back');
    }
    next();
  });

  router.get('/', index);
  router.post('/', submit);

  router.get('/oauth', indexOAuth);
  router.post('/oauth', submitOAuth);

  app.use('/join', router);
};
