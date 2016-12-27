'use strict';

var i18n = require('i18n');

module.exports.setup = function (app) {
  app.get('/search', function (req, res, next) {
    req.api.getPopularSearchWords().then(response => {
      res.render('search/search', {
        title: [
          i18n.__('search'),
          i18n.__('common.jakduk')
        ],
        q: req.query.q || '',
        w: req.query.w || '',
        from: req.query.from || '',
        size: req.query.size || '',
        popularSearchWords: response.data.popularSearchWords || {},
      });
    }).catch(next);
  });
};
