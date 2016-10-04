'use strict';

var proxy = require('express-http-proxy');

var config = require('../config/environment');
var Util = require('../helpers/jakduk_util');
var slack = require('../helpers/slack_notifier')(config.slack);

module.exports = function (path) {
  return proxy(config.internalApiServerUrl, {
    reqBodyEncoding: null,
    reqAsBuffer: true,
    forwardPath (req) {
      return path + '/' + req.url;
    },
    decorateRequest (proxyReqOpt, req) {
      if (req.cookies[config.tokenCookieName]) {
        proxyReqOpt.headers[config.tokenHeader] = req.cookies[config.tokenCookieName];
      }
    },
    intercept (proxyRes, data, req, res, callback) {
      if (proxyRes.statusCode === 200 && req.method && req.path === '/board/free') {
        const body = JSON.parse(data.toString('utf8'));
        req.api.getPost(body.seq).then(function (response) {
          let og = Util.ogFromPost(response.data.post, 200);
          slack({
            author: og.author,
            subject: og.title,
            link: og.link,
            text: og.description,
            image: og.image
          });
        });
      }
      callback(null, data);
    }
  });
};