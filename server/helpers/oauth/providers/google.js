const axios = require('axios');
const querystring = require('querystring');

module.exports = function(google) {
  return {
    getLoginUrl: function () {
      return 'https://accounts.google.com/o/oauth2/v2/auth?' +
        querystring.stringify({
          client_id: google.clientID,
          redirect_uri: google.callbackURL,
          response_type: 'code',
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        });
    },
    authorize: function (code) {
      return axios.post('https://www.googleapis.com/oauth2/v4/token', null, {
        params: {
          code: code,
          client_id: google.clientID,
          redirect_uri: google.callbackURL,
          client_secret: google.clientSecret,
          grant_type: 'authorization_code',
        },
      });
    }
  };
};
