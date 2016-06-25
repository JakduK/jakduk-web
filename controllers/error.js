'use strict';

function ErrorController(app) {
  this.app = app;
}

ErrorController.prototype.notFound = function(path) {
  this.app.use(path, function notFound(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};

ErrorController.prototype.all = function(path) {
  var isProd = this.app.get('env') === 'production';
  this.app.use(path, function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
      message: err.message,
      error: isProd ? '' : err.stack,
      code: err.status || 500,
      req: req,
      now: Date.now()
    });
  });
};

module.exports = ErrorController;