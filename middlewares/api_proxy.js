'use strict';

var proxy = require('http-proxy-middleware');
var bodyParser = require('body-parser').json();

var config = require('../config/environment');
var TagUtil = require('../helpers/tag_util');
var ApiClient = require('../helpers/jakduk_api_client');
var slack = require('../helpers/slack_notifier')(config.slack);

module.exports = function () {
  return proxy('/api', {
    logLevel: config.env === 'production' ? 'info' : 'debug',
    pathRewrite: {'^/api': ''},
    changeOrigin: true,
    target: config.internalApiServerUrl,
    onProxyReq: function (proxyReq, req) {
      if (req.cookies[config.tokenCookieName]) {
        proxyReq.setHeader(config.tokenHeader, req.cookies[config.tokenCookieName]);
      }
    },
    onProxyRes: function (proxyRes, req, res) {
      if (proxyRes.statusCode === 200 && req.method && req.path === '/board/free') {
        var credentials = {};
        credentials[config.tokenHeader] = req.cookies[config.tokenCookieName] || '';
        bodyParser(proxyRes, res, function () {
          new ApiClient(
            credentials,
            req.headers.cookie,
            config.internalApiServerUrl
          ).getPost(proxyRes.body.seq).then(function (response) {
            var postSummary = TagUtil.ogFrom(response.data.post.content, 200);
            slack({
              author: response.data.post.writer.username,
              subject: response.data.post.subject,
              link: config.origin + '/board/free/' + response.data.post.seq,
              text: postSummary.description,
              image: postSummary.image
            });
          });
        });
      }
    }
  });
};