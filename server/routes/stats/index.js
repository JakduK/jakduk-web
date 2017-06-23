const express = require('express');
const i18n = require('i18n');

module.exports.setup = function (app) {
  const supportersRouter = express.Router();
  const attendanceRouter = express.Router();

  supportersRouter.get('/supporters', (req, res, next) => {
    res.locals.title = [
      i18n.__('stats.supporters'),
      i18n.__('stats'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  attendanceRouter.get('/league', (req, res, next) => {
    res.locals.title = [
      i18n.__('stats.attendance.league.title'),
      i18n.__('stats'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  attendanceRouter.get('/club', (req, res, next) => {
    res.locals.title = [
      i18n.__('stats.attendance.club.title'),
      i18n.__('stats'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  attendanceRouter.get('/season', (req, res, next) => {
    res.locals.title = [
      i18n.__('stats.attendance.season.title'),
      i18n.__('stats'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  app.use('/stats', supportersRouter);
  app.use('/stats/attendance', attendanceRouter);
};
