'use strict';

var express = require('express');
var _ = require('lodash');

function postList(req, res) {
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

function commentList(req, res) {
  Promise.all([
    req.api.getComments({
      page: req.query.page,
      size: req.query.size
    }),
    req.api.getTopPosts()
  ]).then(function (responses) {
    responses.forEach(function(response) {
      _.merge(res.locals, response.data);
    });
    res.render('board/comment_list', {
      title: ['board.free.breadcrumbs.comments', 'board.name.free', 'common.jakduk'],
      head_page: 'head_board',
      number: res.locals.number + 1
    });
  });
}

function viewPost(req, res) {
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

function writePost(req, res) {
  res.render('board/post_write', {
    title: ['board.write', 'common.jakduk'],
    head_page: 'head_board_view'
  });
}

function editPost(req, res) {
  req.api.getPost(req.params.id).then(function (response) {
    var data = response.data;
    res.render('board/post_write', {
      pre_title: data.subject,
      title: ['board.edit', 'common.jakduk'],
      head_page: 'head_board_view',
      post: data.post
    });
  });
}

module.exports.setup = function(app) {
  var router = express.Router();

  router.get('/free', postList);

  router.get('/free/posts', postList);

  router.get('/free/comments', commentList);

  router.get('/free/write', writePost);

  router.get('/free/edit/:id', editPost);

  router.get('/free/:id', viewPost);

  app.use('/board', router);
};
