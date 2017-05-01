const Util = require('../../helpers/jakduk_util');

module.exports.setup = function (app) {
  app.get('/logout', function (req, res, next) {
    req.api.logout().then(() => {
      Util.clearSession(res);
      res.redirect('back');
    }).catch(next);
  });
};
