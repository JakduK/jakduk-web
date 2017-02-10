'use strict';

var Util = require('../../helpers/jakduk_util');

module.exports.setup = function (app) {
  app.get('/logout', function (req, res, next) {
    req.api.logout().then(function () {
      Util.clearSession(res);
      res.redirect('back');
    }).catch(function (err) {
      next(err);
    });
  });
};
