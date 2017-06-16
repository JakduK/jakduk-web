const i18n = require('i18n');

module.exports.setup = function (app) {
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    err.statusMessage = 'Not Found';
    next(err);
  });

  app.use((err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status);
    res.render('index', {
      layout: false,
      err: {
        status: err.status,
        message: err.message,
        stack: err.stack
      }
    });
  });
};
