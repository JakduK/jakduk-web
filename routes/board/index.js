'use strict';

var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var i18n = require('i18n');
var TagUtil = require('../../helpers/tag_util');

function postList(req, res, next) {
  var category = _.toUpper(!req.query.category || req.query.category === 'none' ? 'all' : req.query.category);
  Promise.all([
    req.api.getTopPosts(),
    req.api.getPosts({
      page: req.query.page,
      size: req.query.size,
      category: category
    }),
    req.api.getBoardCategories(req.query.lang || req.cookies.lang)
  ]).then(function (responses) {
    responses.forEach(function (response) {
      _.extend(res.locals, response.data);
    });
    res.render('board/post_list', {
      title: [
        i18n.__('board.free.breadcrumbs.posts'),
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ],
      todayDate: moment(new Date().setHours(0, 0, 0, 0)).valueOf(),
      category: category,
      number: res.locals.number + 1
    })
  }).catch(function (err) {
    next(err);
  });
}

function commentList(req, res, next) {
  Promise.all([
    req.api.getComments({
      page: req.query.page,
      size: req.query.size
    }),
    req.api.getTopPosts()
  ]).then(function (responses) {
    responses.forEach(function (response) {
      _.extend(res.locals, response.data);
    });
    res.render('board/comment_list', {
      title: [
        i18n.__('board.free.breadcrumbs.comments'),
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ],
      number: res.locals.number + 1
    });
  }).catch(function (err) {
    next(err);
  });
}

function viewPost(req, res, next) {
  req.api.getPost(req.params.id).then(function (response) {
    var context = res.locals;
    var postData = response.data;
    var metaContent;

    if (!postData.post.status.delete) {
      metaContent = TagUtil.ogFrom(postData.post.content, 120);

      _.extend(context.meta, {
        og: {
          image: metaContent.image || context.meta.og.image,
          description: metaContent.description || postData.post.subject,
          type: 'article'
        }
      });
    }

    if (response.headers['set-cookie']) {
      res.append('Set-Cookie', response.headers['set-cookie']);
    }
    res.render('board/post_view', {
      title: [
        postData.post.status.delete ? i18n.__('board.msg.deleted') : postData.post.subject,
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ],
      nextPost: postData.nextPost,
      prevPost: postData.prevPost,
      post: _.extend(postData.post, {
        galleries: postData.post.galleries || []
      })
    });
  }).catch(function (err) {
    next(err);
  });
}

function writePost(req, res, next) {
  if (!req.isAuthenticated) {
    res.redirect('/login');
    return;
  }

  req.api.getBoardCategories(req.query.lang || req.cookies.lang).then(function (response) {
    res.render('board/post_write', {
      title: [
        i18n.__('board.write'),
        i18n.__('common.jakduk')
      ],
      categories: response.data.categories
    });
  }).catch(function (err) {
    next(err);
  });
}

function editPost(req, res, next) {
  if (!req.isAuthenticated) {
    res.redirect('/login');
    return;
  }

  Promise.all([
    req.api.getBoardCategories(req.query.lang || req.cookies.lang),
    req.api.getPost(req.params.id)
  ]).then(function (responses) {
    var categories = responses[0].data.categories;
    var postData = responses[1].data;
    res.render('board/post_write', {
      title: [
        i18n.__(postData.post.subject),
        i18n.__('board.edit'),
        i18n.__('common.jakduk')
      ],
      categories: categories,
      post: postData.post
    });
  }).catch(function (err) {
    next(err);
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
