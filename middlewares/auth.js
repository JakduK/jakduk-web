'use strict';

var _ = require('lodash');
var rest = require('../util/rest');

module.exports = function(app, path) {
  app.use(path || '/', function(req, res, next) {
    _.every(req.cookies, function (value, name) {
      res.cookie(name, value);
    });

    rest.userInfo({
      headers: {
        cookie: req.headers.cookie || ''
      }
    }, function (data, response) {
      if (response.statusCode === 200) {
        res.locals.userInfo = data;
      }
      res.locals.isAuthenticated = !!res.locals.userInfo;
      next();
    });
  })
};