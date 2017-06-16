const querystring = require('querystring');
const Util = require('../helpers/jakduk_util');
const config = require('../config/environment');
const _ = require('lodash');
const i18n = require('i18n');

module.exports = function () {
  return function defaultContext(req, res, next) {
    req.api.getUserInfo().then(response => {
      if (response.statusCode === 200) {
        req.userInfo = response.data;
      } else if (req.cookies[config.tokenCookieName] && req.cookies[config.tempTokenCookieFlag] !== 'true') {
        Util.clearSession(res);
      }

      req.isAuthenticated = !!req.userInfo;

      if (req.isAuthenticated) {
        res.locals.isAdmin = req.userInfo.roles.some(role => role === 'ROLE_ROOT');
        req.isAdmin = res.locals.isAdmin;
      }

      _.extend(res.locals, {
        redir: `?redir=${querystring.escape(req.url)}`,
        layout: 'layout',
        userInfo: req.userInfo,
        isAuthenticated: req.isAuthenticated,
        isIE: /trident|msie/i.test(req.headers['user-agent']),
        meta: {
          twitter: {
            card: 'summary'
          },
          og: {
            description: i18n.__('about.summary'),
            url: `${config.origin}${req.path}`,
            image: `${config.origin}/jakduk/img/logo_256.png`,
            type: 'website'
          },
          facebook: {
            appId: config.facebook.clientID
          }
        }
      });

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      next();
    }).catch(next);
  };
};
