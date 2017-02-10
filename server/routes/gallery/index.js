'use strict';

var express = require('express');
var _ = require('lodash');
var i18n = require('i18n');
var config = require('../../config/environment');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('gallery/list', {
      title: [
        i18n.__('gallery'),
        i18n.__('common.jakduk')
      ]
    });
  });

  router.get('/:id', function (req, res, next) {
    req.api.getGalleryItem(req.params.id).then(function (response) {
      var context = res.locals;
      var data = response.data;

      _.merge(context.meta, {
        og: {
          image: config.thumbnailServerUrl + req.baseUrl +'/' + req.params.id,
          description: data.gallery.name
        },
        twitter: {
          card: 'summary_large_image'
        }
      });

      if (response.headers['set-cookie']) {
        res.append('Set-Cookie', response.headers['set-cookie']);
      }
      res.render('gallery/item_view', {
        title: [
          data.gallery.name,
          i18n.__('gallery'),
          i18n.__('common.jakduk')
        ],
        gallery: data.gallery,
        linkedPosts: data.linkedPosts,
        next: data.next,
        prev: data.prev
      });
    }).catch(function (err) {
      next(err);
    });
  });

  app.use('/gallery', router);
};
