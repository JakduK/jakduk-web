'use strict';

var SessionUtil = require('../../helpers/jakduk_session_util');

module.exports.setup = function (app) {
  app.get('/logout', function (req, res) {
    req.api.logout().then(function () {
      SessionUtil.clearSession(res);
      res.redirect(req.headers.referer);
    });
  });
};
