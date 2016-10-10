'use strict';

var i18n = require('i18n');
var config = require('../../config/environment');

module.exports.setup = function (app) {
  app.use(function notFound(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    err.statusMessage = 'Not Found';
    next(err);
  });

  app.use(function (err, req, res, next) {
    const statusCode = err.status || 500;
    res.status(statusCode);
    res.render('error/error', {
      title: [
        i18n.__('common.error'),
        i18n.__('common.jakduk')
      ],
      message: err.statusMessage,
      error: config.debug ? err.stack : '',
      code: statusCode,
      req: req,
      now: Date.now()
    });
  });
};
