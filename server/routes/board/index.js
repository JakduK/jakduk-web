const express = require('express');
const _ = require('lodash');
const i18n = require('i18n');
const Util = require('../../helpers/jakduk_util');

module.exports.setup = function (app) {
  const router = express.Router();

  router.get('/:board', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.free.breadcrumbs.posts'),
      i18n.__('board.name.free'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  router.get('/:board/comments', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.free.breadcrumbs.comments'),
      i18n.__('board.name.free'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  router.get('/:board/write', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.write'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  router.get('/:board/edit/:id', (req, res, next) => {
    req.api.getPost(req.params.board, req.params.id).then(response => {
      if (response.statusCode !== 200) {
        next(Util.makeError(response));
        return;
      }

      const postData = response.data;

      if (req.userInfo.id !== postData.article.writer.userId) {
        next(Util.makeForbidden());
        return;
      }

      res.locals.title = [
        i18n.__(postData.article.subject),
        i18n.__('board.edit'),
        i18n.__('common.jakduk')
      ];

      res.render('index', {
        layout: false
      });
    }).catch(next);
  });

  router.get('/:board/:id', (req, res, next) => {
    req.api.getPost(req.params.board, req.params.id).then(response => {
      if (response.statusCode !== 200) {
        next(Util.makeError(response));
        return;
      }

      const articleData = response.data;
      const article = articleData.article;

      if (req.params.board !== article.board.toLowerCase()) {
        res.redirect(`/board/${article.board.toLowerCase()}/${article.seq}`);
        return;
      }

      if (!article.status || !article.status.delete) {
        _.merge(res.locals.meta, {
          og: Util.ogFromPost(article, 120)
        });
      }

      if (response.headers['set-cookie']) {
        res.append('Set-Cookie', response.headers['set-cookie']);
      }

      res.locals.title = [
        (article.status && article.status.delete) ? i18n.__('board.msg.deleted') : article.subject,
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ];

      res.render('index', {
        layout: false
      });
    }).catch(next);
  });

  app.use('/board', router);
};
