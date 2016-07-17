'use strict';

module.exports.setup = function (app) {
  app.use('/admin', function (req, res) {
    if (!req.isAdmin) {
      res.render('error/denied', {
        pre_title: 'ADMIN PAGE',
        title: ['common.jakduk'],
        head_page: 'head_error'
      });
      return;
    }

    res.render('admin/admin', {
      pre_title: 'ADMIN PAGE',
      title: ['common.jakduk'],
      baseHref: '/',
      head_page: 'head_admin'
    });
  });
};
