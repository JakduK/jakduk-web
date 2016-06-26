var SessionUtil = require('../util/jakduk_session_util');
var config = require('../config/environment');
var _ = require('lodash');
var Api = require('./jakduk_api');

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
        layout: 'layout',
        bodyClass: 'header-fixed',
        apiServerUrl: config.apiServerUrl,
        thumbnailServerUrl: config.thumbnailServerUrl,
        userInfo: req.userInfo,
        isAuthenticated: req.isAuthenticated
      });

      next();
    });
  });
};