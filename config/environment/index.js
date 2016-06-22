var _ = require('lodash');

var env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// All configurations will extend these options
var all = {
  env: env,

  port: process.env.PORT || 9000,

  locale: {
    list: ['ko', 'en'],
    default: 'ko',
    alias: {
      'ko-*': 'ko',
      'en-*': 'en'
    }
  },

  apiServerUrl: 'https://jakduk.com/api',
  thumbnailServerUrl: 'https://jakduk.com',
  noRedirectPaths: ['/login', '/logout'],

  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  }
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
