'use strict';

var rest = require('restler');
var querystring = require('querystring');

module.exports = function(facebook) {
  return {
    getLoginUrl: function () {
      return 'https://www.facebook.com/dialog/oauth?' +
        querystring.stringify({
          client_id: facebook.clientID,
          redirect_uri: facebook.callbackURL,
          response_type: 'code',
          scope: 'public_profile,email'
        });
    },
    authorize: function (code) {
      return new Promise(function (resolve) {
        rest.get('https://graph.facebook.com/v2.3/oauth/access_token?' +
          querystring.stringify({
            code: code,
            client_id: facebook.clientID,
            redirect_uri: facebook.callbackURL,
            client_secret: facebook.clientSecret
          })
        ).on('complete', function (data, response) {
          response.data = data;
          resolve(response);
        });
      });
    }
  };
};