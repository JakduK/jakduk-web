'use strict';

var path = require('path');
var url = require('url');

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var proxy = require('http-proxy-middleware');

var config = require('../config/environment');

function setup(app) {
  app.set('env', config.env);
  app.set('port', config.port);
  app.set('trust proxy', true);
  app.locals.gaAccount = config.gaAccount;
  app.locals.kakaoClientID = config.kakao.clientID;

  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  require('./handlebars')(app);

  app.use(logger(config.env === 'production'  ? 'combined' : 'dev'));
  app.use(proxy('/api', {
    logLevel: config.env === 'production' ? 'info' : 'debug',
    pathRewrite: {'^/api': ''},
    changeOrigin: true,
    target: config.internalApiServerUrl
  }));

  app.use(compression());
  app.use(express.static(path.join(__dirname, '..', 'static')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // essential
  require('../middlewares/default_context')(app);

  // i18n setup
  require('../middlewares/i18n')(app);

  // register routes
  require('../routes')(app);
}

module.exports = setup;
