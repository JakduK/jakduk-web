const i18n = require('i18n');

module.exports.setup = function (app) {
  app.get('/about', (req, res, next) => {
    res.locals.title = [
      i18n.__('about.site'),
      i18n.__('common.jakduk')
    ];

    next();
  });
};
