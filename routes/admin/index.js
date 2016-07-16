'use strict';

module.exports.setup = function (app) {
  app.use('/admin', function (req, res) {
    if (!req.isAdmin) {
      res.redirect('back');
      return;
    }

    res.render('admin/admin', {
      pre_title: 'ADMIN PAGE',
      title: ['common.jakduk'],
      head_page: 'head_admin'
    });
  });
};
