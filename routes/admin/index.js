'use strict';

module.exports.setup = function (app) {
  app.use('/admin', function (req, res) {
    if (!req.isAdmin) {
      res.render('error/denied', {
        title: [{
          val: 'ADMIN PAGE'
        }, {
          key: 'common.jakduk'
        }],
        headPage: 'head_error'
      });
      return;
    }

    res.render('admin/admin', {
      title: [{
        val: 'ADMIN PAGE'
      }, {
        key: 'common.jakduk'
      }],
      baseHref: '/',
      headPage: 'head_admin'
    });
  });
};
