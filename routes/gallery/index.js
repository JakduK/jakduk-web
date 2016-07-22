'use strict';

var express = require('express');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('gallery/list', {
      title: [{
        key: 'gallery'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_gallery'
    });
  });

  router.get('/:id', function (req, res) {
    req.api.getGalleryItem(req.params.id).then(function (response) {
      var data = response.data;
      res.cookie('GALLERY_' + req.params.id, 'r', {
        httpOnly: true
      });
      res.render('gallery/item_view', {
        title: [{
          key: 'gallery'
        }, {
          key: 'common.jakduk'
        }],
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
