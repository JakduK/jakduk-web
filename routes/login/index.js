'use strict';

var express = require('express');
var _ = require('lodash');
var SessionUtil = require('../../helpers/jakduk_session_util');
var config = require('../../config/environment');

function index(req, res) {
  res.render('login/login', {
    redir: req.headers.referer,
    head_page: 'head_login'
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
        result: 'failure',
        message: response.data.message,
        head_page: 'head_login'
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
