'use strict';

module.exports.setup = function(app) {
  app.get('/about', function(req, res) {
    res.render('about/intro', {
      title: ['about.site', 'common.jakduk'],
      headPage: 'head_about'
    })
  });
};