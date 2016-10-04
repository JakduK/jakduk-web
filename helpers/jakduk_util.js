'use strict';

var querystring = require('querystring');
var _s = require('underscore.string');

var config = require('../config/environment');

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
    return {
      author: post.writer.username,
      title: post.subject,
      link: config.origin + '/board/free/' + post.seq,
      image: (post.content.match(/<img.+src=(['"])(.*?)\1/) || [])[2],
      description: _s(post.content).unescapeHTML().stripTags().truncate(limit).value() || post.subject,
      type: 'article'
    };
  }
};