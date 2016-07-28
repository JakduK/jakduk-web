'use strict';

var SessionUtil = require('../helpers/jakduk_session_util');
var ApiClient = require('../helpers/jakduk_api_client');
var config = require('../config/environment');
var _ = require('lodash');
var i18n = require('i18n');

module.exports = function (app) {
  app.use(function (req, res, next) {
    req.noRedirectPaths = config.noRedirectPaths;
    req.api = new ApiClient(req.headers.cookie || '', config.internalApiServerUrl);

    req.api.getUserInfo().then(function (response) {
      if (response.statusCode === 200) {
        req.userInfo = response.data;
      } else if (response.statusCode === 401) {
        SessionUtil.clearSession(res);
      }

      req.isAuthenticated = !!req.userInfo;
      if (req.isAuthenticated) {
        res.locals.isAdmin = req.userInfo.roles.some(function (role) {
          return role === 'ROLE_ROOT';
        });
        req.isAdmin = res.locals.isAdmin;
      }

      _.extend(res.locals, {
        layout: 'layout',
        bodyClass: 'header-fixed',
        apiServerUrl: config.apiServerUrl,
        thumbnailServerUrl: config.thumbnailServerUrl,
        userInfo: req.userInfo,
        isAuthenticated: req.isAuthenticated,
        meta: {
          twitter: {
            card: 'summary'
          },
          og: {
            description: i18n.__('about.jakduk'),
            url: config.origin + req.path,
            image: config.origin + '/jakduk/img/logo_256.png',
            type: 'website'
          },
          facebook: {
            appId: config.facebook.clientID
          }
        }
      });

      next();
    });
  });
};
