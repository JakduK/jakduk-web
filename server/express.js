const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const apiClient = require('./middlewares/api_client');
const apiProxy = require('./middlewares/api_proxy');
const config = require('./config/environment');
const i18nMdw = require('./middlewares/i18n');
const defaultContext = require('./middlewares/default_context');
const express = require('express');

module.exports = setup(express());

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
  app.set('views', path.resolve('server', 'views'));

  // view engine setup
  require('./config/handlebars')(app);

  if (config.env !== 'production') {
    const webpackConfig = require('../webpack.config');
    const compiler = require('webpack')(webpackConfig);
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    app.use(devMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      quiet: false
    }));

    app.use(hotMiddleware(compiler, {
      log(output) {
        console.log(output);
      }
    }));
  }

  app.use(logger(config.env === 'production' ? 'combined' : 'dev'));
  app.use(compression());
  app.use('/assets', [
    express.static(path.resolve('dist')),
    express.static(path.resolve('assets')),
    express.static(path.resolve('client')),
    express.static(path.resolve('node_modules'))
  ]);
  app.get('*.html', express.static(path.resolve('assets', 'html')));
  app.use(cookieParser());
  app.use(apiClient.middleware());
  app.use('/api', apiProxy('/api', config.internalApiServerUrl));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(i18nMdw());
  app.use(defaultContext());

  // register routes
  require('./routes')(app);

  app.use('*', (err, req, res, next) => {
    err.status = err.status || 500;
    res.status(err.status);
    res.render('index', {
      layout: false,
      err: {
        status: err.status,
        message: err.message,
        stack: err.stack
      }
    });
  });

  app.use('*', (req, res, next) => {
    res.render('index', {
      layout: false
    });
  });

  return app;
}
