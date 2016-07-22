'use strict';

var express = require('express');
var i18n = require('i18n');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_error'
    });
  });

  router.get('/supporters', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_error'
    });
  });

  router.get('/attendance', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_error'
    });
  });

  app.use('/stats', router);
};
