const config = require('../../config/environment');

module.exports = {
  facebook: require('./providers/facebook')(config.facebook),
  google: require('./providers/google')(config.google),
  naver: require('./providers/naver')(config.naver),
  kakao: require('./providers/kakao')(config.kakao)
};
