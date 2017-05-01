module.exports = function (ApiClient) {
  ApiClient.prototype.getUserProfile = function () {
    return this.requestGetJson(`${this.serverUrl}/user/profile/me`);
  };

  ApiClient.prototype.getUserInfo = function () {
    return this.requestGetJson(`${this.serverUrl}/auth/user`);
  };
};
