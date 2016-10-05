'use strict';

var _ = require('lodash');

var env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

var envConfig;
if (env === 'production') {
  envConfig = require('./' + env + '.js')[process.env.ENV || 'staging'];
} else {
  envConfig = require('./' + env + '.js');
}

try {
  _.merge(envConfig, require('./local'));
} catch (e) {
}

// All configurations will extend these options
var defaultConfig = {
  env: env,

  port: process.env.PORT || 3000,

  tokenCookieName: 'JKTK',

  tokenMaxAge: Math.floor(1000 * 60 * 60 * 24 * 365 * 0.5),

  tokenHeader: 'authorization',

  tempTokenHeader: 'x-attempt-token',

  thumbnailServerUrl: 'https://api.jakduk.com',

  locale: {
    list: ['ko', 'en'],
    default: 'ko',
    alias: {
      'ko-*': 'ko',
      'en-*': 'en'
    }
  },

  noRedirectPaths: [
    '/admin',
    '/login',
    '/logout',
    '/join',
    '/join/oauth',
    '/password/reset',
    '/password/find'
  ],

  viewAbusePreventCookie: 'FREE_BOARD_<%= seq %>=r',

  uploadMaxFileSize: Math.pow(1024, 2) * 8, // '8MB'

  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: envConfig.origin + '/auth/facebook/callback'
  },

  daum: {
    clientID: process.env.DAUM_ID || '',
    clientSecret: process.env.DAUM_SECRET || '',
    callbackURL: envConfig.origin + '/auth/daum/callback'
  },

  kakao: {
    clientID: process.env.KAKAO_ID || ''
  },

  slack: {},

  gaAccount: ''
};

module.exports = _.merge(
  defaultConfig,
  envConfig
);
