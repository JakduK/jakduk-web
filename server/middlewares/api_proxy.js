const hpm = require('http-proxy-middleware');
const _ = require('lodash');

const ApiClient = require('../middlewares/api_client').ApiClient;
const config = require('../config/environment');
const Util = require('../helpers/jakduk_util');
const telegram = require('../helpers/telegram_notifier')(config.telegram);

function boardHook(resData, req) {
  new ApiClient(
    `${(req.headers.cookie || '')}; ${_.template(config.viewAbusePreventCookie)({seq: resData.seq})}`,
    config.internalApiServerUrl
  ).getPost(resData.board, resData.seq).then(response => {
    const og = Util.ogFromPost(response.data.article, 200);
    telegram({
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
}

function boardCommentHook(resData, req) {
  new ApiClient(
    `${(req.headers.cookie || '')}; ${_.template(config.viewAbusePreventCookie)({seq: resData.article.seq})}`,
    config.internalApiServerUrl
  ).getPost(resData.article.board, resData.article.seq).then(response => {
    const post = Util.ogFromPost(response.data.article, 200);
    const comment = Util.ogFromPost({
      seq: resData.article.seq,
      subject: response.data.article.subject,
      writer: resData.writer,
      board: resData.article.board,
      content: resData.content
    }, 200);
    telegram({
      author: comment.author,
      subject: post.title,
      link: post.link,
      text: comment.description,
      isPost: false
    });
  });
}

const ApiHooks = [
  ApiHook(/^\/board\/(?:[a-z]+?)\/(?:\d+?)\/comment$/, boardCommentHook),
  ApiHook(/^\/board\/(?:[a-z]+?)$/, boardHook)
];

function ApiHook(testRegexp, runFunc) {
  return {
    test(string) {
      return testRegexp.test(string);
    },
    run: runFunc
  };
}

module.exports = function (path, dest) {
  return hpm(path, {
    target: dest,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: ''
    },
    onProxyRes(proxyRes, req) {
      const urlPath = /\/$/.test(req.path) ? req.path.replace(/\/$/, '') : req.path;

      if (proxyRes.statusCode === 301) {
        let orgLocation = proxyRes.headers['location'];
        if (orgLocation && orgLocation.includes('/api/board')) {
          proxyRes.headers['location'] = `${config.origin}${orgLocation.substring(orgLocation.indexOf('/board'))}`;
        }
      }

      if (proxyRes.statusCode === 200 && req.method === 'POST') {
        _.each(ApiHooks, hook => {
          if (hook.test(urlPath)) {
            const chunks = [];
            proxyRes.on('data', chunk => {
              chunks.push(chunk);
            });
            proxyRes.on('end', () => {
              const payload = Buffer.concat(chunks, _(chunks).reduce((len, chunk) => len + chunk.length, 0));
              hook.run(JSON.parse(payload.toString('utf8')), req);
            });
            return false;
          }
        });
      }
    }
  });
};
