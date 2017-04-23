const express = require('express');
const _ = require('lodash');
const i18n = require('i18n');
const Util = require('../../helpers/jakduk_util');

module.exports.setup = function (app) {
  const router = express.Router();

  router.get('/free', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.free.breadcrumbs.posts'),
      i18n.__('board.name.free'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  router.get('/free/comments', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.free.breadcrumbs.comments'),
      i18n.__('board.name.free'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  router.get('/free/write', (req, res, next) => {
    res.locals.title = [
      i18n.__('board.write'),
      i18n.__('common.jakduk')
    ];

    next();
  });

  router.get('/free/edit/:id', (req, res, next) => {
    req.api.getPost(req.params.id).then(response => {
      if (response.statusCode !== 200) {
        next(Util.makeError(response));
        return;
      }

      const postData = response.data;

      if (req.userInfo.id !== postData.post.writer.userId) {
        next(Util.makeForbidden());
        return;
      }

      res.locals.title = [
        i18n.__(postData.post.subject),
        i18n.__('board.edit'),
        i18n.__('common.jakduk')
      ];

      next();
    }).catch(next);
  });

  router.get('/free/:id', (req, res, next) => {
    req.api.getPost(req.params.id).then(response => {
      if (response.statusCode !== 200) {
        next(Util.makeError(response));
        return;
      }

      const postData = response.data;

      if (!postData.post.status || !postData.post.status.delete) {
        _.merge(res.locals.meta, {
          og: Util.ogFromPost(postData.post, 120)
        });
      }

      if (response.headers['set-cookie']) {
        res.append('Set-Cookie', response.headers['set-cookie']);
      }

      res.locals.title = [
        (postData.post.status && postData.post.status.delete) ? i18n.__('board.msg.deleted') : postData.post.subject,
        i18n.__('board.name.free'),
        i18n.__('common.jakduk')
      ];

      next();
    }).catch(next);
  });

  app.use('/board', router);
};
