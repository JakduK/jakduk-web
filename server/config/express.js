'use strict';

const path = require('path');
const url = require('url');

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const apiClient = require('../middlewares/api_client');
const apiProxy = require('../middlewares/api_proxy');
const config = require('../config/environment');
const i18n = require('../middlewares/i18n');
const defaultContext = require('../middlewares/default_context');

function setup(app) {
  app.locals.gaAccount = config.gaAccount;
  app.locals.kakaoClientID = config.kakao.clientID;
  app.locals.apiServerUrl = config.apiServerUrl;
  app.locals.thumbnailServerUrl = config.thumbnailServerUrl;
  app.locals.noRedirectPaths = config.noRedirectPaths;

  app.set('env', config.env);
  app.set('port', config.port);
  app.set('trust proxy', true);
  app.set('views', path.join(__dirname, '..', 'views'));

  // view engine setup
  require('./handlebars')(app);

  app.use(logger(config.env === 'production'  ? 'combined' : 'dev'));
  app.use(compression());
  if (config.env !== 'production') {
    app.use('/static', express.static(path.join(__dirname, '..', '..')));
    app.use('/static', express.static(path.join(__dirname, '..', '..', 'client')));
  }
  app.get('/\*.html', express.static(path.join(__dirname, '..', '..', 'client', 'static')));
  app.use(cookieParser());
  app.use(apiClient.middleware());
  app.use('/api', apiProxy('/api', config.internalApiServerUrl));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(i18n());
  app.use(defaultContext());

  // register routes
  require('../routes')(app);
}

module.exports = setup;
