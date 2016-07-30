'use strict';

var i18n = require('i18n');

module.exports.setup = function (app) {
  app.get('/search', function (req, res) {
    res.render('search/search', {
      title: [
        i18n.__('search'),
        i18n.__('common.jakduk')
      ],
      q: req.query.q || '',
      w: req.query.w || '',
      from: req.query.from || '',
      size: req.query.size || ''
    });
  });
};
