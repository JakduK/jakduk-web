var rest = require('restler');
var querystring = require('querystring');

module.exports = function(daum) {
  return {
    getLoginUrl: function() {
      return 'https://apis.daum.net/oauth2/authorize?' +
        querystring.stringify({
          client_id: daum.clientID,
          redirect_uri: daum.callbackURL,
          response_type: 'code'
        });
    },
    authorize: function (code) {
      return new Promise(function (resolve) {
        rest.post('https://apis.daum.net/oauth2/token', {
          data: {
            client_id: daum.clientID,
            client_secret: daum.clientSecret,
            redirect_uri: daum.callbackURL,
            code: code,
            grant_type: 'authorization_code'
          }
        }).on('complete', function (data, response) {
          response.data = data;
          resolve(response);
        });
      });
    }
  };
};