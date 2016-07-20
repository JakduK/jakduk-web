'use strict';

var express = require('express');
var _ = require('lodash');
var moment = require('moment');

function postList(req, res) {
  var category = _.toUpper(!req.query.category || req.query.category === 'none' ? 'all' : req.query.category);
  Promise.all([
    req.api.getTopPosts(),
    req.api.getPosts({
      page: req.query.page,
      size: req.query.size,
      category: category
    }),
    req.api.getBoardCategories()
  ]).then(function (responses) {
    responses.forEach(function (response) {
      _.merge(res.locals, response.data);
    });
    res.render('board/post_list', {
      title: ['board.free.breadcrumbs.posts', 'board.name.free', 'common.jakduk'],
      headPage: 'head_board',
      todayDate: moment(new Date().setHours(0, 0, 0, 0)).valueOf(),
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
    responses.forEach(function (response) {
      _.merge(res.locals, response.data);
    });
    res.render('board/comment_list', {
      title: ['board.free.breadcrumbs.comments', 'board.name.free', 'common.jakduk'],
      headPage: 'head_board',
      number: res.locals.number + 1
    });
  });
}

function viewPost(req, res) {
  req.api.getPost(req.params.id).then(function (response) {
    var postData = response.data;
    res.render('board/post_view', {
      preTitle: postData.post.subject,
      title: ['board.name.free', 'common.jakduk'],
      headPage: 'head_board_view',
      nextPost: postData.nextPost,
      prevPost: postData.prevPost,
      post: _.merge(postData.post, {
        galleries: postData.post.galleries || []
      })
    });
  });
}

function writePost(req, res) {
  if (!req.isAuthenticated) {
    res.redirect('/login');
    return;
  }

  req.api.getBoardCategories().then(function (response) {
    res.render('board/post_write', {
      title: ['board.write', 'common.jakduk'],
      headPage: 'head_board_view',
      categories: response.data.categories
    });
  });
}

function editPost(req, res) {
  if (!req.isAuthenticated) {
    res.redirect('/login');
    return;
  }

  Promise.all([
    req.api.getBoardCategories(),
    req.api.getPost(req.params.id)
  ]).then(function (responses) {
    var categories = responses[0].data.categories;
    var postData = responses[1].data;
    res.render('board/post_write', {
      preTitle: postData.post.subject,
      title: ['board.edit', 'common.jakduk'],
      headPage: 'head_board_view',
      categories: categories,
      post: postData.post
    });
  });
}

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/free', postList);

  router.get('/free/posts', postList);

  router.get('/free/comments', commentList);

  router.get('/free/write', writePost);

  router.get('/free/edit/:id', editPost);

  router.get('/free/:id', viewPost);

  app.use('/board', router);
};
