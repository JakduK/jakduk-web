const express = require('express');
const i18n = require('i18n');

module.exports.setup = function (app) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    res.locals.title = [
      i18n.__('jakdu.schedule'),
      i18n.__('jakdu'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  router.get('/:id', (req, res, next) => {
    res.locals.title = [
      i18n.__('jakdu.view'),
      i18n.__('jakdu'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  router.get('/write', (req, res, next) => {
    res.locals.title = [
      i18n.__('jakdu.write'),
      i18n.__('jakdu'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  app.use('/jakdu', router);
};
