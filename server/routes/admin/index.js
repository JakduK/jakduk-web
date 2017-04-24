const i18n = require('i18n');

module.exports.setup = function (app) {
  app.use('/admin', (req, res) => {
    if (!req.isAdmin) {
      res.render('error/denied', {
        title: [
          'ADMIN PAGE',
          i18n.__('common.jakduk')
        ]
      });
      return;
    }

    res.render('admin/admin', {
      title: [
        'ADMIN PAGE',
        i18n.__('common.jakduk')
      ],
      baseHref: '/'
    });
  });
};
