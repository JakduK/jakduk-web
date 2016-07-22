'use strict';

module.exports.setup = function (app) {
  app.get('/search', function (req, res) {
    res.render('error/coming_soon', {
      title: [{
        key: 'search'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_error'
    });
  });
};
