'use strict';

var express = require('express');
var i18n = require('i18n');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('jakdu/schedule', {
      title: [
        i18n.__('jakdu.schedule'),
        i18n.__('jakdu'),
        i18n.__('common.jakduk')
      ]
    });
  });

  router.get('/:id', function (req, res) {
    res.render('jakdu/view', {
      title: [
        i18n.__('jakdu.view'),
        i18n.__('jakdu'),
        i18n.__('common.jakduk')
      ]
    });
  });

  router.get('/write', function (req, res) {
    res.render('jakdu/write', {
      title: [
        i18n.__('jakdu.write'),
        i18n.__('jakdu'),
        i18n.__('common.jakduk')
      ]
    });
  });

  app.use('/jakdu', router);
};
