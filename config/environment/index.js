var _ = require('lodash');

var env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

var origin = process.env.ORIGIN || 'https://jakduk.com';

// All configurations will extend these options
var all = {
  env: env,

  port: process.env.PORT || 3000,

  origin: origin,

  apiServerUrl: process.env.API_SERVER || 'https://jakduk.com/api',

  thumbnailServerUrl: 'https://jakduk.com',

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
    clientID:     process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL:  origin + '/auth/facebook/callback'
  },

  daum: {
    clientID:     process.env.DAUM_ID || '',
    clientSecret: process.env.DAUM_SECRET || '',
    callbackURL:  origin + '/auth/daum/callback'
  },

  gaAccount: 'UA-59051176-1'
};

var local = {};
try {
  local = require('./local');
} catch (e) {}

module.exports = _.merge(
  all,
  require('./' + env + '.js') || {},
  local
);
