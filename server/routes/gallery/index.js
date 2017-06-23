const express = require('express');
const _ = require('lodash');
const i18n = require('i18n');
const config = require('../../config/environment');
const Util = require('../../helpers/jakduk_util');

module.exports.setup = function (app) {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    res.locals.title = [
      i18n.__('gallery'),
      i18n.__('common.jakduk')
    ];

    res.render('index', {
      layout: false
    });
  });

  router.get('/:id', (req, res, next) => {
    req.api.getGalleryItem(req.params.id).then(response => {
      if (response.statusCode !== 200) {
        next(Util.makeError(response));
        return;
      }

      const context = res.locals;
      const data = response.data;

      _.merge(context.meta, {
        og: {
          image: `${config.thumbnailServerUrl}${req.baseUrl}'/'${req.params.id}`,
          description: data.gallery.name
        },
        twitter: {
          card: 'summary_large_image'
        }
      });

      if (response.headers['set-cookie']) {
        res.append('Set-Cookie', response.headers['set-cookie']);
      }

      res.locals.title = [
        data.gallery.name,
        i18n.__('gallery'),
        i18n.__('common.jakduk')
      ];

      res.render('index', {
        layout: false
      });
    }).catch(next);
  });

  app.use('/gallery', router);
};
