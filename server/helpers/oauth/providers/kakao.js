const querystring = require('querystring');
const axios = require('axios');

module.exports = function(kakao) {
  return {
    getLoginUrl: function() {
      return 'https://kauth.kakao.com/oauth/authorize?' +
        querystring.stringify({
          client_id: kakao.clientID,
          redirect_uri: kakao.callbackURL,
          response_type: 'code',
        });
    },
    authorize: function (code) {
      return axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          code: code,
          client_id: kakao.clientID,
          redirect_uri: kakao.callbackURL,
          client_secret: kakao.clientSecret,
          grant_type: 'authorization_code',
        },
      });
    }
  };
};
