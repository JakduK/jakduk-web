const axios = require('axios');
const querystring = require('querystring');

module.exports = function(naver) {
  return {
    getLoginUrl: function () {
      return 'https://nid.naver.com/oauth2.0/authorize?' +
        querystring.stringify({
          client_id: naver.clientID,
          redirect_uri: naver.callbackURL,
          response_type: 'code',
        });
    },
    authorize(code) {
      return axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
          code: code,
          client_id: naver.clientID,
          redirect_uri: naver.callbackURL,
          client_secret: naver.clientSecret,
          grant_type: 'authorization_code'
        },
      });
    }
  };
};
