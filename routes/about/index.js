'use strict';

module.exports.setup = function(app) {
  app.get('/about', function(req, res) {
    res.render('about/intro', {
      head_page: 'head_about'
    })
  });
};