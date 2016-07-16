'use strict';

var express = require('express');
var _ = require('lodash');

function list(req, res) {
  var category = _.toUpper(!req.query.category || req.query.category === 'none' ? 'all' : req.query.category);
  Promise.all([
    req.api.getPosts({
      page: req.query.page,
      size: req.query.size,
      category: category
    }),
    req.api.getTopPosts()
  ]).then(function(responses) {
    responses.forEach(function(response) {
      _.merge(res.locals, response.data);
    });
    res.render('board/post_list', {
      title: ['board.free.breadcrumbs.posts', 'board.name.free', 'common.jakduk'],
      head_page: 'head_board',
      nowDate: Date.now(),
      category: category,
      number: res.locals.number + 1
    })
  });
}

function view(req, res) {
  req.api.getPost(req.params.id).then(function (response) {
    var data = response.data;
    res.render('board/post_view', {
      pre_title: data.subject,
      title: ['board.name.free', 'common.jakduk'],
      head_page: 'head_board_view',
      post: data.post,
      nextPost: data.nextPost,
      prevPost: data.prevPost
    });
  });
}

module.exports.setup = function(app) {
  var router = express.Router();

  router.get('/free', list);

  router.get('/free/posts', list);

  router.get('/free/:id', view);

  app.use('/board', router);
};
