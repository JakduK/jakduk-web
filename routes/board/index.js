'use strict';

var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var TagUtil = require('../../helpers/tag_util');

function postList(req, res) {
  var category = _.toUpper(!req.query.category || req.query.category === 'none' ? 'all' : req.query.category);
  Promise.all([
    req.api.getTopPosts(),
    req.api.getPosts({
      page: req.query.page,
      size: req.query.size,
      category: category
    }),
    req.api.getBoardCategories(req.query.lang)
  ]).then(function (responses) {
    responses.forEach(function (response) {
      _.merge(res.locals, response.data);
    });
    res.render('board/post_list', {
      title: [{
        key: 'board.free.breadcrumbs.posts'
      }, {
        key: 'board.name.free'
      }, {
        key: 'common.jakduk'
      }],
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
      title: [{
        key: 'board.free.breadcrumbs.comments'
      }, {
        key: 'board.name.free'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_board',
      number: res.locals.number + 1
    });
  });
}

function viewPost(req, res) {
  req.api.getPost(req.params.id).then(function (response) {
    var postData = response.data;
    var og = res.locals.og;

    _.merge(og, TagUtil.ogFrom(postData.post.content, 120), {
      type: 'article'
    });

    res.cookie('FREE_BOARD_' + req.params.id, 'r', {
      httpOnly: true
    });
    res.render('board/post_view', {
      title: [{
        val: postData.post.subject
      }, {
        key: 'board.name.free'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_board_view',
      nextPost: postData.nextPost,
      prevPost: postData.prevPost,
      post: _.merge(postData.post, {
        galleries: postData.post.galleries || []
      }),
      og: og
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
      title: [{
        key: 'board.write'
      }, {
        key: 'common.jakduk'
      }],
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
    req.api.getBoardCategories(req.query.lang),
    req.api.getPost(req.params.id)
  ]).then(function (responses) {
    var categories = responses[0].data.categories;
    var postData = responses[1].data;
    res.render('board/post_write', {
      title: [{
        val: postData.post.subject
      }, {
        key: 'board.edit'
      }, {
        key: 'common.jakduk'
      }],
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
