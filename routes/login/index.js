'use strict';

var express = require('express');
var _ = require('lodash');
var i18n = require('i18n');
var SessionUtil = require('../../helpers/jakduk_session_util');
var config = require('../../config/environment');

function index(req, res) {
  res.render('login/login', {
    title: [
      i18n.__('user.sign.in'),
      i18n.__('common.jakduk')
    ],
    headPage: 'head_login',
    redir: req.headers.referer
  });
}

function submit(req, res) {
  req.api.login(
    req.body.j_username,
    req.body.j_password,
    req.body.remember === 'on'
  ).then(function (response) {
    if (response.statusCode === 200) {
      SessionUtil.saveSession(res, response);
      var redir = req.body.redir || '/';
      redir = _.some(req.noRedirectPaths, function (value) {
        return redir.endsWith(value);
      }) ? '/' : redir;
      res.redirect(redir);
    } else {
      res.render('login/login', {
        title: [
          i18n.__('user.sign.in'),
          i18n.__('common.jakduk')
        ],
        headPage: 'head_login',
        message: i18n.__('common.exception.not.found.jakduk.account')
      });
    }
  });
}

module.exports.setup = function (app) {
  app.use('/login', function (req, res, next) {
    if (req.isAuthenticated) {
      res.redirect('/home');
    }
    next();
  });

  app.route('/login')
    .get(index)
    .post(submit);
};
