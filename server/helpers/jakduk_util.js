const querystring = require('querystring');
const _s = require('underscore.string');
const _ = require('lodash');
const i18n = require('i18n');
const config = require('../config/environment');

const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

module.exports = {
  saveSession(res, authResponse) {
    if (_.isString(authResponse)) {
      res.cookie(config.tokenCookieName, authResponse, {
        httpOnly: true,
        secure: config.secureCookie
      });
    } else {
      let authCookies = authResponse.headers['set-cookie'];

      if (!authCookies) {
        return;
      }

      authCookies = _.isArray(authCookies) ? authCookies : [authCookies];

      _.each(authCookies, cookie => {
        res.append('Set-Cookie', `${cookie}${config.secureCookie ? '; Secure' : ''}`);
      });
    }
  },
  clearSession(res) {
    res.clearCookie(config.tokenCookieName);
    res.clearCookie(config.refreshTokenCookieName);
  },
  redirect(target, callbackUrl, res) {
    res.redirect(target + '?redir=' + querystring.escape(callbackUrl));
  },
  ogFromPost(post, limit) {
    const og = {
      author: post.writer.username,
      title: post.subject,
      link: config.origin + '/board/free/' + post.seq,
      description: _s(post.content).unescapeHTML().stripTags().truncate(limit).value() || post.subject,
      type: 'article'
    };

    let image = post.content.match(/<img.+?src=(['"])(.*?)\1/ig);
    let video = post.content.match(/<iframe.+?src=(['"])(.*?)\1/ig);

    if (image) {
      image = image[0].match(/src=(['"])(.*?)\1/)[2];
      if (image.startsWith('//')) {
        image = 'https:' + image;
      }
      og.image = image;
    }

    if (video) {
      video = video[0].match(/src=(['"])(.*?)\1/)[2];
      const ytMatch = (video.startsWith('//') ? 'https:' + video : video).match(ytRegExp);
      if (ytMatch && ytMatch[1].length === 11) {
        let youtubeId = ytMatch[1];
        video = 'https://www.youtube.com/watch?v=' + youtubeId;
        og.video = video;
        og.videoProvider = 'Youtube';
      }
    }

    return og;
  },
  makeError(response) {
    const err = new Error(JSON.stringify({
      type: response.req ? 'api error' : 'server unavailable',
      api: response.req ? `${response.req.agent.protocol}${response.req._headers.host}${response.req.path}` : '',
      data: response.data
    }, null, 2));
    err.status = response.statusCode;
    err.statusMessage = response.statusMessage;
    return err;
  },
  makeForbidden() {
    const err = new Error(i18n.__('common.msg.error.401'));
    err.status = 401;
    err.statusMessage = 'Unauthorized';
    return err;
  }
};
