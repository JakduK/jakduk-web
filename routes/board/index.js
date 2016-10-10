'use strict';

var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var i18n = require('i18n');
var Util = require('../../helpers/jakduk_util');

function postList(req, res, next) {
  var category = _.toUpper(!req.query.category || req.query.category === 'none' ? 'all' : req.query.category);
  Promise.all([
    req.api.getTopPosts(),
    req.api.getPosts({
      page: req.query.page,
      size: req.query.size,
      category: category
    }),
    req.api.getBoardCategories(req.locale)
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
  req.api.getPost(req.params.id).then(response => {
    if (response.statusCode !== 200) {
      next(Util.makeError(response));
      return;
    }

    var postData = response.data;

    if (!postData.post.status || !postData.post.status.delete) {
      _.merge(res.locals.meta, {
        og: Util.ogFromPost(postData.post, 120)
      });
    }

    if (response.headers['set-cookie']) {
      res.append('Set-Cookie', response.headers['set-cookie']);
    }
    res.render('board/post_view', {
      title: [
        (!postData.post.status || postData.post.status.delete) ? i18n.__('board.msg.deleted') : postData.post.subject,
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ],
      nextPost: postData.nextPost,
      prevPost: postData.prevPost,
      post: _.extend(postData.post, {
        galleries: postData.post.galleries || []
      }),
      latestPostsByWriter: postData.latestPostsByWriter
    });
  }).catch(err => next(err));
}

function writePost(req, res, next) {
  if (!req.isAuthenticated) {
    Util.redirect('/login', req.originalUrl, res);
    return;
  }

  req.api.getBoardCategories(req.locale).then(function (response) {
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
    Util.redirect('/login', req.originalUrl, res);
    return;
  }

  Promise.all([
    req.api.getPost(req.params.id),
    req.api.getBoardCategories(req.locale)
  ]).then(function (responses) {
    if (responses[0].statusCode !== 200) {
      next();
      return;
    }

    var postData = responses[0].data;
    var categories = responses[1].data.categories;

    if (req.userInfo.id !== postData.post.writer.userId) {
      next(Util.makeForbidden());
      return;
    }

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

  router.get('/free/comments', commentList);

  router.get('/free/write', writePost);

  router.get('/free/edit/:id', editPost);

  router.get('/free/:id', viewPost);

  app.use('/board', router);
};
