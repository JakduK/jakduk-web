const _ = require('lodash');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

let envConfig;

if (env === 'production') {
  envConfig = require(`./${env}.js`)[process.env.ENV || 'staging'];
} else {
  envConfig = require(`./${env}.js`);
}

try {
  _.merge(envConfig, require('../../../local'));
} catch (e) {
}

// All configurations will extend these options
const defaultConfig = {
  revision: '',

  env: env,

  port: process.env.PORT || 3000,

  secureCookie: false,

  tokenCookieName: 'JSESSIONID',

  tempTokenCookieFlag: 'TMP_JSESSION',

  refreshTokenCookieName: 'remember-me',

  thumbnailServerUrl: 'https://api.jakduk.com',

  locale: {
    list: ['ko-KR', 'en-US'],
    default: 'ko-KR',
    alias: {
      'ko-*': 'ko-KR',
      'en-*': 'en-US'
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

  viewAbusePreventCookie: 'ARTICLE_<%= seq %>=r',

  uploadMaxFileSize: Math.pow(1024, 2) * 8, // '8MB'

  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: `${envConfig.origin}/auth/facebook/callback`
  },

  google: {
    clientID: process.env.GOOGLE_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
    callbackURL: `${envConfig.origin}/auth/google/callback`
  },

  naver: {
    clientID: process.env.NAVER_ID || '',
    clientSecret: process.env.NAVER_SECRET || '',
    callbackURL: `${envConfig.origin}/auth/naver/callback`
  },

  kakao: {
    clientID: process.env.KAKAO_ID || ''
  },

  slack: {},

  telegram: {},

  gaAccount: ''
};

module.exports = _.merge(
  defaultConfig,
  envConfig
);
