'use strict';

module.exports.setup = function (app) {
  app.get('/search', function (req, res) {
    res.render('error/coming_soon', {
      title: ['search', 'common.jakduk'],
      headPage: 'head_error'
    });
  });
};
