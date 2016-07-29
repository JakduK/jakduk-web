'use strict';

var i18n = require('i18n');

module.exports.setup = function(app) {
  app.get('/about', function(req, res) {
    res.render('about/intro', {
      title: [
        i18n.__('about.site'),
        i18n.__('common.jakduk')
      ]
    })
  });
};
