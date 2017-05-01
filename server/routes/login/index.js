const querystring = require('querystring');
const _ = require('lodash');
const i18n = require('i18n');
const Util = require('../../helpers/jakduk_util');
const config = require('../../config/environment');

function index(req, res) {
  res.render('login/login', {
    title: [
      i18n.__('user.sign.in'),
      i18n.__('common.jakduk')
    ],
    redir: `?redir=${querystring.escape(req.query.redir || '')}`
  });
}

function submit(req, res, next) {
  req.api.login(
    req.body.username,
    req.body.password
  ).then(function (response) {
    const status = response.statusCode;

    if (status === 200) {
      let redir = req.query.redir || '/';

      redir = _.some(req.noRedirectPaths, function (value) {
        return redir.endsWith(value);
      }) ? '/' : redir;

      Util.saveSession(res, response.headers[config.tokenHeader], req.body.remember === 'on');

      res.redirect(redir);
    } else {
      let message;

      if (status === 400) {
        message = 'common.exception.wrong.password';
      } else {
        message = 'common.exception.not.found.jakduk.account';
      }

      res.render('login/login', {
        title: [
          i18n.__('user.sign.in'),
          i18n.__('common.jakduk')
        ],
        message: i18n.__(message)
      });
    }
  }).catch(function (err) {
    next(err);
  });
}

module.exports.setup = function (app) {
  app.use('/login', function (req, res, next) {
    if (req.isAuthenticated) {
      res.redirect('/home');
    }
    next();
  });

  app.route('/login')
    .get(index)
    .post(submit);
};
