var SessionUtil = require('../util/jakduk.session.util');
var config = require('../config/environment');
var _ = require('lodash');
var Api = require('./jakduk.api');

module.exports = function (app) {
  app.use(function(req, res, next) {
    req.noRedirectPaths = config.noRedirectPaths;
    req.api = new Api(req.headers.cookie, config.apiServerUrl);
    req.api.profile(function (data, response) {
      if (response.statusCode === 200) {
        req.userInfo = data;
      } else {
        SessionUtil.clearSession(res);
      }

      req.isAuthenticated = !!req.userInfo;

      _.merge(res.locals, {
        apiServerUrl: config.apiServerUrl,
        thumbnailServerUrl: config.thumbnailServerUrl,
        userInfo: req.userInfo,
        isAuthenticated: req.isAuthenticated
      });

      next();
    });
  });
};