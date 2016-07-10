'use strict';

var express = require('express');

module.exports.setup = function(app) {
  var router = express.Router();

  router.get('/', function (req, res) {
    res.render('board/freePosts')
  });

  app.use('/board', router);
};