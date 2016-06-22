var config = require('../config/environment');

module.exports = function (app) {
  app.use(function(req, res, next) {
    res.locals.apiServerUrl = config.apiServerUrl;
    res.locals.thumbnailServerUrl = config.thumbnailServerUrl;
    next();
  });
};