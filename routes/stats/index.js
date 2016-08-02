'use strict';

var express = require('express');
var i18n = require('i18n');

module.exports.setup = function (app) {
  var supportersRouter = express.Router();
  var attendanceRouter = express.Router();

  supportersRouter.get('/', function (req, res) {
    res.redirect('/stats/supporters?' + (req.query.chartType || ''));
  });

  supportersRouter.get('/supporters', function (req, res) {
    res.render('stats/supporters', {
      title: [
        i18n.__('stats.supporters'),
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ],
      chartType: req.query.chartType
    });
  });

  attendanceRouter.get('/league', function (req, res) {
    res.render('stats/attendance_league', {
      title: [
        i18n.__('stats.attendance.league.title'),
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ]
    });
  });

  attendanceRouter.get('/club', function (req, res) {
    res.render('stats/attendance_club', {
      title: [
        i18n.__('stats.attendance.club.title'),
        i18n.__('stats'),
        i18n.__('common.jakduk')
      ]
    });
  });

  attendanceRouter.get('/season', function (req, res) {
    req.api.footballClubs(req.locale).then(function (response) {
      var footballClubs = response.data;
      res.render('stats/attendance_season', {
        title: [
          i18n.__('stats.attendance.season.title'),
          i18n.__('stats'),
          i18n.__('common.jakduk')
        ],
        footballClubs: footballClubs
      });
    });
  });

  app.use('/stats', supportersRouter);
  app.use('/stats/attendance', attendanceRouter);
};
