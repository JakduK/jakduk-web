'use strict';

module.exports.setup = function(app) {
  app.get('/about', function(req, res) {
    res.render('about/intro', {
      title: [{
        key: 'about.site'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_about'
    })
  });
};
