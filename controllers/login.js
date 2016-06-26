'use strict';

var express = require('express');
var _ = require('lodash');
var SessionUtil = require('../util/jakduk_session_util');
var config = require('../config/environment');

function LoginController(app) {
  this.app = app;
}

LoginController.prototype.join = function(path) {
  this.app.route(path)
    .get(function(req, res) {
      req.api.footballClubs(req.locale, function(data, response) {
        res.render('login/join', {
          head_page: 'head_login',
          footballClubs: data,
          redir: req.headers.referer
        });
      });
    }).post(function(req, res) {
      var body = req.body;
      req.api.join({
        email: body.email,
        username: body.username,
        password: body.password,
        passwordConfirm: body.passwordConfirm,
        footballClub: body.footballClub,
        about: body.about
      }, function(data, response) {
        if (response.statusCode === 200) {
          SessionUtil.saveSession(res, response);
          res.redirect(body.redir || '/');
        } else {
          res.render('login/join', {
            head_page: 'head_login'
          });
        }
      });
    });
};

LoginController.prototype.login = function(path) {
  this.app.route(path)
    .get(function(req, res) {
      if (req.isAuthenticated) {
        res.redirect('/');
        return;
      }

      res.render('login/login', {
        redir: req.headers.referer,
        head_page: 'head_login'
      });
    })
    .post(function(req, res) {
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
            message: 'common.exception.not.found.jakduk.account',
            head_page: 'head_login'
          });
        } else {
          res.render('login/login', {
            result: 'failure',
            message: 'common.exception.io',
            head_page: 'head_login'
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
    res.render('login/password_reset', {
      head_page: 'head_password'
    });
  });
};

LoginController.prototype.findPassword = function(path) {
  this.app.route(path)
    .get(function(req, res) {
      res.render('login/password_find', {
        head_page: 'head_password'
      });
    })
    .post(function(req, res) {
      req.api.findPassword(req.body.email, config.origin + '/password/reset')
        .then(function(response) {
          var data = response.data;
          res.render('login/password_find_message', {
            head_page: 'head_password',
            subject: data.subject,
            message: data.message
          });
        });
    });
};

LoginController.prototype.resetPassword = function(path) {
  this.app.route(path)
    .get(function(req, res) {
      req.api.checkResetPasswordCode(req.params.code)
        .then(function(response) {
          if (response.statusCode === 200) {
            res.render('login/password_reset', {
              head_page: 'head_password',
              code: req.params.code
            });
          } else {
            res.render('login/password_find_message', {
              head_page: 'head_password',
              message: response.data.message
            });
          }
        });
    })
    .post(function(req, res) {
      req.api.resetPassword(req.body.code, req.body.password)
        .then(function(response) {
          var data = response.data;
          res.render('login/password_find_message', {
            head_page: 'head_password',
            subject: data.subject,
            message: data.message
          });
        });
    });
};

module.exports = LoginController;