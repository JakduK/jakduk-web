'use strict';

var querystring = require('querystring');
var _s = require('underscore.string');
var i18n = require('i18n');
var config = require('../config/environment');

const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

module.exports = {
  saveSession (res, token, remember) {
    var options = {httpOnly: true};
    if (remember) {
      options.maxAge = config.tokenMaxAge;
    }
    res.cookie(config.tokenCookieName, token, options);
  },
  clearSession (res) {
    res.clearCookie(config.tokenCookieName);
  },
  redirect (target, callbackUrl, res) {
    res.redirect(target + '?redir=' + querystring.escape(callbackUrl));
  },
  ogFromPost (post, limit) {
    let og = {
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
      let ytMatch = (video.startsWith('//') ? 'https:' + video : video).match(ytRegExp);
      if (ytMatch && ytMatch[1].length === 11) {
        let youtubeId = ytMatch[1];
        video = 'https://www.youtube.com/watch?v=' + youtubeId;
        og.video = video;
        og.videoProvider = 'Youtube';
      }
    }

    return og;
  },
  makeError (response) {
    let err = new Error(JSON.stringify({
      type: 'api error',
      api: response.req.agent.protocol + '//' + response.req._headers.host + response.req.path,
      data: response.data
    }, null, 2));
    err.status = response.statusCode;
    err.statusMessage = response.statusMessage;
    return err;
  },
  makeForbidden() {
    let err = new Error(i18n.__('common.msg.error.401'));
    err.status = 401;
    err.statusMessage = 'Unauthorized';
    return err;
  }
};