const querystring = require('querystring');

module.exports = function (ApiClient) {
  ApiClient.prototype.join = function (data) {
    return this.requestPostJson(`${this.serverUrl}/user`, {
      data
    });
  };

  ApiClient.prototype.joinWith = function (data) {
    return this.requestPostJson(`${this.serverUrl}/user/social`, {
      data
    });
  };

  ApiClient.prototype.login = function (username, password, remember) {
    return this.requestPost(`${this.serverUrl}/auth/login`, {
      data: {
        username: username,
        password: password,
        'remember-me': remember
      }
    });
  };

  ApiClient.prototype.loginWith = function (provider, accessToken) {
    return this.requestPostJson(`${this.serverUrl}/auth/login/${provider}`, {
      data: {
        accessToken: accessToken
      }
    });
  };

  ApiClient.prototype.socialAttempt = function () {
    return this.requestGetJson(`${this.serverUrl}/auth/user/attempt`);
  };

  ApiClient.prototype.logout = function () {
    return this.requestGet(`${this.serverUrl}/auth/logout`);
  };

  ApiClient.prototype.findPassword = function (email, callbackUrl) {
    return this.requestPostJson(`${this.serverUrl}/password/find`, {
      query: {
        email: email,
        callbackUrl: callbackUrl
      }
    });
  };

  ApiClient.prototype.checkResetPasswordCode = function (code) {
    return this.requestGetJson(`${this.serverUrl}/password/reset/${querystring.escape(code)}`);
  };

  ApiClient.prototype.resetPassword = function (code, newPwd) {
    return this.requestPostJson(`${this.serverUrl}/password/reset`, {
      query: {
        password: newPwd,
        code: code
      }
    });
  };
};
