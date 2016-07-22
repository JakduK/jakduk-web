'use strict';

var express = require('express');

module.exports.setup = function (app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('error/coming_soon', {
      title: [{
        key: 'gallery'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_error'
    });
  });

  router.get('/list', function (req, res) {
    res.render('error/coming_soon', {
      title: [{
        key: 'gallery'
      }, {
        key: 'common.jakduk'
      }],
      headPage: 'head_error'
    });
  });

  app.use('/gallery', router);
};
