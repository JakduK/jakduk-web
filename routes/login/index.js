'use strict';

var querystring = require('querystring');
var express = require('express');
var _ = require('lodash');
var i18n = require('i18n');
var Util = require('../../helpers/jakduk_util');
var config = require('../../config/environment');

function index(req, res) {
  res.render('login/login', {
    title: [
      i18n.__('user.sign.in'),
      i18n.__('common.jakduk')
    ],
    redir: querystring.escape(req.query.redir || '')
  });
}

function submit(req, res, next) {
  req.api.login(
    req.body.username,
    req.body.password
  ).then(function (response) {
    var status = response.statusCode;
    var redir;
    var message;

    if (status === 200) {
      Util.saveSession(res, response.headers[config.tokenHeader], req.body.remember === 'on');
      redir = req.query.redir || '/';
      redir = _.some(req.noRedirectPaths, function (value) {
        return redir.endsWith(value);
      }) ? '/' : redir;
      res.redirect(redir);
    } else {
      if (status === 400) {
        message = 'common.exception.wrong.password';
      } else {
        message = 'common.exception.not.found.jakduk.account';
      }
      res.render('login/login', {
        title: [
          i18n.__('user.sign.in'),
          i18n.__('common.jakduk')
        ],
        message: i18n.__(message)
      });
    }
  }).catch(function (err) {
    next(err);
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
