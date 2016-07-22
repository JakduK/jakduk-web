'use strict';

var i18n = require('i18n');

module.exports.setup = function (app) {
  app.get('/search', function (req, res) {
    res.render('error/coming_soon', {
      title: [
        i18n.__('search'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_error'
    });
  });
};
