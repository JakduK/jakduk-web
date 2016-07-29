'use strict';

var SessionUtil = require('../../helpers/jakduk_session_util');

module.exports.setup = function (app) {
  app.get('/logout', function (req, res, next) {
    req.api.logout().then(function () {
      SessionUtil.clearSession(res);
      res.redirect('back');
    }).catch(function (err) {
      next(err);
    });
  });
};
