'use strict';

var proxy = require('express-http-proxy');
var _ = require('lodash');

var ApiClient = require('../middlewares/api_client').ApiClient;
var config = require('../config/environment');
var Util = require('../helpers/jakduk_util');
var slack = require('../helpers/slack_notifier')(config.slack);

var apiHooks = {
  '/board/free' (resData, req) {
    new ApiClient({
        [config.tokenHeader]: req.cookies[config.tokenCookieName] || ''
      },
      (req.headers.cookie || '') + '; ' + _.template(config.viewAbusePreventCookie)({seq: resData.seq}),
      config.internalApiServerUrl
    ).getPost(resData.seq).then(response => {
      let og = Util.ogFromPost(response.data.post, 200);
      slack({
        author: og.author,
        subject: og.title,
        link: og.link,
        text: og.description,
        image: og.image,
        video: og.video,
        videoProvider: og.videoProvider,
        isPost: true
      });
    });
  },
  '/board/free/comment' (resData, req) {
    new ApiClient({
        [config.tokenHeader]: req.cookies[config.tokenCookieName] || ''
      },
      (req.headers.cookie || '') + '; ' + _.template(config.viewAbusePreventCookie)({seq: resData.boardItem.seq}),
      config.internalApiServerUrl
    ).getPost(resData.boardItem.seq).then(response => {
      let post = Util.ogFromPost(response.data.post, 200);
      let comment = Util.ogFromPost(resData, 200);
      slack({
        author: comment.author,
        subject: post.title,
        link: post.link,
        text: comment.description,
        isPost: false
      });
    });
  }
};

module.exports = function (path) {
  return proxy(config.internalApiServerUrl, {
    reqBodyEncoding: null,
    reqAsBuffer: true,
    limit: config.uploadMaxFileSize,
    forwardPath (req) {
      return path + '/' + req.url;
    },
    decorateRequest (proxyReqOpt, req) {
      if (req.cookies[config.tokenCookieName]) {
        proxyReqOpt.headers[config.tokenHeader] = req.cookies[config.tokenCookieName];
      }
    },
    intercept (proxyRes, data, req, res, callback) {
      if (apiHooks[req.path] && proxyRes.statusCode === 200 && req.method === 'POST') {
        apiHooks[req.path](JSON.parse(data.toString('utf8')), req);
      }

      callback(null, data);
    }
  });
};