'use strict';

var express = require('express');
var config = require('../../config/environment');

function index(req, res) {
  res.render('login/password_reset', {
    head_page: 'head_password'
  });
}

function indexFindPassword(req, res) {
  res.render('login/password_find', {
    head_page: 'head_password'
  });
}

function submitFindPassword(req, res) {
  req.api.findPassword(req.body.email, config.origin + '/password/reset')
    .then(function (response) {
      var data = response.data;
      res.render('login/password_find_message', {
        head_page: 'head_password',
        subject: data.subject,
        message: data.message
      });
    });
}

function indexResetPassword(req, res) {
  req.api.checkResetPasswordCode(req.params.code)
    .then(function (response) {
      if (response.statusCode === 200) {
        res.render('login/password_reset', {
          head_page: 'head_password',
          message: response.data.message,
          code: req.params.code
        });
      } else {
        res.render('login/password_find_message', {
          head_page: 'head_password',
          message: response.data.message
        });
      }
    });
}

function submitResetPassword(req, res) {
  req.api.resetPassword(req.body.code, req.body.password)
    .then(function (response) {
      var data = response.data;
      res.render('login/password_find_message', {
        head_page: 'head_password',
        subject: data.subject,
        message: data.message
      });
    });
}

module.exports.setup = function (app) {
  var router = express.Router();

  router.use('/', function (req, res, next) {
    if (req.isAuthenticated) {
      res.redirect('/home');
    }
    next();
  });

  router.get('/', index);

  router.get('/find', indexFindPassword);
  router.post('/find', submitFindPassword);

  router.get('/reset/:code', indexResetPassword);
  router.post('/reset', submitResetPassword);

  app.use('/password', router);
};
