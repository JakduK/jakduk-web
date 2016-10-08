'use strict';

var querystring = require('querystring');
var express = require('express');
var i18n = require('i18n');
var config = require('../../config/environment');
var Util = require('../../helpers/jakduk_util');

function index(req, res, next) {
  req.api.footballClubs(req.locale).then(function (response) {
    var footballClubs = response.data;
    res.render('login/join', {
      title: [
        i18n.__('user.register'),
        i18n.__('common.jakduk')
      ],
      footballClubs: footballClubs,
      redir: '?redir=' + querystring.escape(req.query.redir || ''),
      bySocialAccount: false
    });
  }).catch(function (err) {
    next(err);
  });
}

function submit(req, res, next) {
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
      Util.saveSession(res, response.headers[config.tokenHeader]);
      res.redirect(req.query.redir || '/');
    } else {
      res.render('login/join', {
        title: [
          i18n.__('user.register'),
          i18n.__('common.jakduk')
        ]
      });
    }
  }).catch(function (err) {
    next(err);
  });
}

function indexOAuth(req, res, next) {
  var tempToken = req.cookies[config.tokenCookieName] || '';
  Promise.all([
    req.api.socialAttempt(tempToken),
    req.api.footballClubs(req.locale)
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
      footballClubs: footballClubs,
      redir: '?redir=' + querystring.escape(req.query.redir || ''),
      bySocialAccount: true,
      snsProfile: snsProfile,
      tempToken: tempToken
    });
  }).catch(function (err) {
    next(err);
  });
}

function submitOAuth(req, res, next) {
  var body = req.body;
  req.api.joinWith(body.tempToken || '', {
    email: body.email,
    username: body.username,
    footballClub: body.footballClub,
    about: body.about
  }).then(function (response) {
    if (response.statusCode === 200) {
      Util.saveSession(res, response.headers[config.tokenHeader]);
      res.redirect(req.query.redir || '/');
    } else {
      res.redirect('/login');
    }
  }).catch(function (err) {
    next(err);
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
