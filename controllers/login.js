'use strict';

var express = require('express');
var SessionUtil = require('../util/jakduk.session.util');
var _ = require('lodash');

function LoginController(app) {
  this.app = app;
}

LoginController.prototype.login = function(path) {
  this.app.route(path)
    .get(function(req, res) {
      if (req.isAuthenticated) {
        res.redirect('/');
        return;
      }

      res.render('login/login', {
        redir: req.headers.referer
      });
    })
    .post(function (req, res) {
      req.api.login({
        username: req.body.j_username,
        password: req.body.j_password
      }, function(data, response) {
        if (response.statusCode === 200) {
          SessionUtil.saveSession(res, response);
          var redir = req.body.redir || '/';
          redir = _.some(req.noRedirectPaths, function(value) {
            return redir.endsWith(value);
          }) ? '/' : redir;
          res.redirect(redir);
        } else if (response.statusCode === 404) {
          res.render('login/login', {
            result: 'failure',
            message: 'common.exception.not.found.jakduk.account'
          });
        } else {
          res.render('login/login', {
            result: 'failure',
            message: 'common.exception.io'
          });
        }
      });
    });
};

LoginController.prototype.logout = function(path) {
  this.app.get(path, function(req, res) {
    req.api.logout(function() {
      SessionUtil.clearSession(res);
      res.redirect(req.headers.referer);
    });
  });
};

LoginController.prototype.password = function(path) {
  this.app.get(path, function(req, res) {
    res.render('login/passwordReset');
  });
};

LoginController.prototype.findPassword = function(path) {
  this.app.get(path, function(req, res) {
    res.render('login/passwordFind');
  });
};

LoginController.prototype.join = function(path) {
  this.app.get(path, function joinGet(req, res) {
    res.render('login/join');
  }).post(path, function joinPost(req, res) {

  });
};

module.exports = LoginController;