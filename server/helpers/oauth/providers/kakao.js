module.exports = function() {
  return {
    getLoginUrl: function() {
      throw new Error('Kakao login url unsupported.');
    },
    authorize: function (data) {
      return new Promise(function (resolve) {
        resolve({
          status: 200,
          data,
        });
      });
    }
  };
};
