'use strict';

module.exports.setup = function (app) {
  app.use('/admin', function (req, res) {
    if (!req.isAdmin) {
      res.render('error/denied', {
        preTitle: 'ADMIN PAGE',
        title: ['common.jakduk'],
        headPage: 'head_error'
      });
      return;
    }

    res.render('admin/admin', {
      preTitle: 'ADMIN PAGE',
      title: ['common.jakduk'],
      baseHref: '/',
      headPage: 'head_admin'
    });
  });
};
