const hpm = require('http-proxy-middleware');
const _ = require('lodash');

const ApiClient = require('../middlewares/api_client').ApiClient;
const config = require('../config/environment');
const Util = require('../helpers/jakduk_util');
const slack = require('../helpers/slack_notifier')(config.slack);

const apiHooks = {
  '/board/free'(resData, req) {
    new ApiClient(
      `${(req.headers.cookie || '')}; ${_.template(config.viewAbusePreventCookie)({seq: resData.seq})}`,
      config.internalApiServerUrl
    ).getPost(resData.seq).then(response => {
      const og = Util.ogFromPost(response.data.post, 200);
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
  '/board/free/comment'(resData, req) {
    new ApiClient(
      `${(req.headers.cookie || '')}; ${_.template(config.viewAbusePreventCookie)({seq: resData.boardItem.seq})}`,
      config.internalApiServerUrl
    ).getPost(resData.boardItem.seq).then(response => {
      const post = Util.ogFromPost(response.data.post, 200);
      const comment = Util.ogFromPost(resData, 200);
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

module.exports = function (path, dest) {
  return hpm(path, {
    target: dest,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: ''
    },
    onProxyRes(proxyRes, req) {
      if (apiHooks[req.path] && proxyRes.statusCode === 200 && req.method === 'POST') {
        const chunks = [];
        proxyRes.on('data', chunk => {
          chunks.push(chunk);
        });
        proxyRes.on('end', () => {
          const payload = Buffer.concat(chunks, _(chunks).reduce((len, chunk) => len + chunk.length, 0));
          apiHooks[req.path](JSON.parse(payload.toString('utf8')), req);
        });
      }
    }
  });
};
