'use strict';

var express = require('express');
var i18n = require('i18n');

function index(req, res) {
  req.api.getUserProfile().then(function (response) {
    res.render('user/profile', {
      title: [
        i18n.__('common.jakduk'),
        i18n.__('user.profile')
      ],
      headPage: 'head_profile',
      userProfile: response.data
    });
  });
}

function editProfile(req, res) {
  Promise.all([
    req.api.getUserProfile(),
    req.api.footballClubs(req.locale)
  ]).then(function (responses) {
    res.render('user/profile_edit', {
      title: [
        i18n.__('common.jakduk'),
        i18n.__('user.profile.update')
      ],
      headPage: 'head_profile',
      userProfile: responses[0].data,
      footballClubs: responses[1].data
    });
  });
}

function updateProfile(req, res, next) {
  next();
}

function editPassword(req, res) {
  res.render('user/password_edit', {
    title: [{
      key: 'common.jakduk'
    }, {
      key: 'user.password.change'
    }],
    headPage: 'head_profile'
  });
}

function updatePassword(req, res, next) {
  next();
}

module.exports.setup = function (app) {
  var router = express.Router();

  router.use(function(req, res, next) {
    if (!req.isAuthenticated) {
      res.redirect('/login');
      return;
    }
    next();
  });

  router.get('/profile', index);

  router.get('/social/profile', index);

  router.get('/profile/edit', editProfile);

  router.post('/profile/update', updateProfile);

  router.get('/password/edit', editPassword);

  router.post('/password/update', updatePassword);

  app.use('/user', router);
};
