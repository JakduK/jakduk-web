'use strict';

var express = require('express');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('error/coming_soon', {
      title: ['stats', 'common.jakduk'],
      headPage: 'head_error'
    });
  });

  router.get('/supporters', function (req, res) {
    res.render('error/coming_soon', {
      title: ['stats', 'common.jakduk'],
      headPage: 'head_error'
    });
  });

  router.get('/attendance', function (req, res) {
    res.render('error/coming_soon', {
      title: ['stats', 'common.jakduk'],
      headPage: 'head_error'
    });
  });

  app.use('/stats', router);
};
