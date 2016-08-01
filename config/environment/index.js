var _ = require('lodash');

var env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

var origin = process.env.ORIGIN || 'https://jakduk.com';

// All configurations will extend these options
var all = {
  env: env,

  port: process.env.PORT || 3000,

  origin: origin,

  tokenCookieName: 'JKTK',

  tokenMaxAge: 1000 * 60 * 60 * 24 * 365 * 2,

  tokenHeader: 'authorization',

  tempTokenHeader: 'x-attempt-token',

  apiServerUrl: process.env.API_SERVER || 'https://jakduk.com/api',

  internalApiServerUrl: process.env.INTERNAL_API_SERVER || 'https://api.jakduk.com/api',

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
    '/login',
    '/logout',
    '/join',
    '/join/oauth',
    '/password/reset',
    '/password/find'
  ],

  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: origin + '/auth/facebook/callback'
  },

  daum: {
    clientID: process.env.DAUM_ID || '',
    clientSecret: process.env.DAUM_SECRET || '',
    callbackURL: origin + '/auth/daum/callback'
  },

  kakao: {
    clientID: process.env.KAKAO_ID || ''
  },

  gaAccount: 'UA-59051176-1'
};

var local = {};
try {
  local = require('./local');
} catch (e) {
}

module.exports = _.merge(
  all,
  require('./' + env + '.js') || {},
  local
);
