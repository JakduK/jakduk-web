'use strict';

var express = require('express');
var _ = require('lodash');

module.exports.setup = function(app) {
  var router = express.Router();

  router.get('/free', function (req, res) {
    var category = !req.query.category || req.query.category === 'none' ? 'all' : req.query.category;
    Promise.all([
      req.api.freePostsList({
        page: req.query.page,
        size: req.query.size,
        category: category
      }),
      req.api.topContents()
    ]).then(function(responses) {
      responses.forEach(function(response) {
        _.merge(res.locals, response.data);
      });
      res.render('board/free_posts', {
        title: ['board.free.breadcrumbs.posts', 'board.name.free', 'common.jakduk'],
        head_page: 'head_board',
        nowDate: Date.now()
      })
    });
  });

  app.use('/board', router);
};