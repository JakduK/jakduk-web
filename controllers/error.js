'use strict';

function notFound(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}

function serverErrorDev(err, req, res) {
  res.status(err.status || 500);
  res.render('error/error', {
    message: err.message,
    error: err.stack,
    code: err.status || 500,
    req: req,
    now: Date.now()
  });
}

function serverErrorProd(err, req, res) {
  res.status(err.status || 500);
  res.render('error/error', {
    message: err.message,
    code: err.status || 500,
    req: req,
    now: Date.now()
  });
}

module.exports = {
  notFound: notFound,
  serverError: {
    dev: serverErrorDev,
    prod: serverErrorProd
  }
};