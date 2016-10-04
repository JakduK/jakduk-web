'use strict';

var proxy = require('express-http-proxy');

var config = require('../config/environment');
var TagUtil = require('../helpers/tag_util');
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
        const body = JSON.parse(data);
        req.api.getPost(body.seq).then(function (response) {
          var postSummary = TagUtil.ogFrom(response.data.post.content, 200);
          slack({
            author: response.data.post.writer.username,
            subject: response.data.post.subject,
            link: config.origin + '/board/free/' + response.data.post.seq,
            text: postSummary.description,
            image: postSummary.image
          });
        });
      }
      callback(null, data);
    }
  });
};