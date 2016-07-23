'use strict';

var express = require('express');
var _ = require('lodash');
var i18n = require('i18n');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('gallery/list', {
      title: [
        i18n.__('gallery'),
        i18n.__('common.jakduk')
      ],
      headPage: 'head_gallery'
    });
  });

  router.get('/:id', function (req, res) {
    req.api.getGalleryItem(req.params.id).then(function (response) {
      var context = res.locals;
      var data = response.data;

      _.merge(context.og, {
        image: context.thumbnailServerUrl + req.baseUrl +'/' + req.params.id,
        description: data.gallery.name
      });

      res.append('Set-Cookie', response.headers['set-cookie']);
      res.render('gallery/item_view', {
        title: [
          data.gallery.name,
          i18n.__('gallery'),
          i18n.__('common.jakduk')
        ],
        headPage: 'head_gallery',
        gallery: data.gallery,
        linkedPosts: data.linkedPosts,
        next: data.next,
        prev: data.prev
      });
    });
  });

  app.use('/gallery', router);
};
