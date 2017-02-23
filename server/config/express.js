const path = require('path');

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const i18n = require('i18n');

const apiClient = require('../middlewares/api_client');
const apiProxy = require('../middlewares/api_proxy');
const config = require('../config/environment');
const i18nMdw = require('../middlewares/i18n');
const defaultContext = require('../middlewares/default_context');

function setup(app) {
  app.locals.revision = config.revision;
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

  app.use(logger(config.env === 'production' ? 'combined' : 'dev'));
  app.use(compression());
  app.use('/assets', [
    express.static(path.join(__dirname, '..', '..', 'dist')),
    express.static(path.join(__dirname, '..', '..', 'assets')),
    express.static(path.join(__dirname, '..', '..', 'client')),
    express.static(path.join(__dirname, '..', '..', 'node_modules'))
  ]);
  app.get(/\*.html/, express.static(path.join(__dirname, '..', 'assets', 'html')));
  app.use(cookieParser());
  app.use(apiClient.middleware());
  app.use('/api', apiProxy('/api', config.internalApiServerUrl));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(i18nMdw());
  app.use(defaultContext());

  app.get(['/', '/home'], (req, res) => {
    if (req.url === '/') {
      res.redirect('/home');
      return;
    }

    res.render('index', {
      layout: false,
      title: [
        i18n.__('common.home'),
        i18n.__('common.jakduk')
      ]
    });
  });

  // register routes
  require('../routes')(app);
}

module.exports = setup;
