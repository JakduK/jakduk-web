'use strict';

var express = require('express');
var i18n = require('i18n');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('jakdu'),
        i18n.__('common.jakduk')
      ]
    });
  });

  router.get('/schedule', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('jakdu'),
        i18n.__('common.jakduk')
      ]
    });
  });

  app.use('/jakdu', router);
};
