'use strict';

module.exports.setup = function (app) {
  app.use(function notFound(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  var isProd = app.get('env') === 'production';
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      head_page: 'head_error',
      message: err.message,
      error: isProd ? '' : err.stack,
      code: err.status || 500,
      req: req,
      now: Date.now()
    });
  });
};
