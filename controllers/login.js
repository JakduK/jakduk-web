var express = require('express');
var _ = require('lodash');
var cookie = require('cookie');
var rest = require('../util/rest');
var config = require('../config/environment');

function loginGet(req, res) {
  res.render('login/login', {
    redir: req.headers.referer
  });
}

function loginPost(req, res) {
  rest.login({
    data: 'username=' + encodeURIComponent(req.body.j_username) + '&password=' + encodeURIComponent(req.body.j_password)
  }, function(data, response) {
    if (response.statusCode === 200) {
      var redir = req.body.redir || '/';
      var resCookies = cookie.parse(response.headers['set-cookie'].join("; "));
      _.every(resCookies, function (value, key) {
        res.cookie(key, value);
      });
      redir = _.some(config.noRedirectPaths, function(value) {
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
}

function logout(req, res) {
  rest.logout({
    headers: {
      cookie: req.headers.cookie || ''
    }
  }, function() {
    res.clearCookie('JSESSIONID');
    res.redirect(req.headers.referer);
  });
}

function password(req, res) {
  res.render('login/passwordReset');
}

function findPassword(req, res) {
  res.render('login/passwordFind');
}

function joinGet(req, res) {
  res.render('login/join');
}

function joinPost(req, res) {

}

module.exports = {
  default: {
    get: loginGet,
    post: loginPost
  },
  logout: logout,
  join: {
    get: joinGet,
    post: joinPost
  },
  password: password,
  findPassword: findPassword
};
