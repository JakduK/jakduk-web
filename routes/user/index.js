'use strict';

var express = require('express');
var i18n = require('i18n');

function index(req, res, next) {
  req.api.getUserProfile().then(function (response) {
    res.render('user/profile', {
      title: [
        i18n.__('user.profile'),
        i18n.__('common.jakduk')
      ],
      userProfile: response.data
    });
  }).catch(function (err) {
    next(err);
  });
}

function editProfile(req, res, next) {
  Promise.all([
    req.api.getUserProfile(),
    req.api.footballClubs(req.locale)
  ]).then(function (responses) {
    res.render('user/profile_edit', {
      title: [
        i18n.__('user.profile.update'),
        i18n.__('common.jakduk')
      ],
      userProfile: responses[0].data,
      footballClubs: responses[1].data
    });
  }).catch(function (err) {
    next(err);
  });
}

function editPassword(req, res) {
  res.render('user/password_edit', {
    title: [
      i18n.__('user.password.change'),
      i18n.__('common.jakduk')
    ]
  });
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

  router.get('/password/edit', editPassword);

  app.use('/user', router);
};
