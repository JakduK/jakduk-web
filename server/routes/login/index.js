const querystring = require('querystring');
const _ = require('lodash');
const i18n = require('i18n');
const Util = require('../../helpers/jakduk_util');

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
    req.body.password,
    req.body.remember === 'on'
  ).then(response => {
    const status = response.statusCode;

    if (status === 200) {
      let redir = req.query.redir || '/';

      redir = _.some(req.noRedirectPaths, value => {
        return redir.endsWith(value);
      }) ? '/' : redir;

      Util.saveSession(res, response);

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
  }).catch(next);
}

module.exports.setup = function (app) {
  app.use('/login', (req, res, next) => {
    if (req.isAuthenticated) {
      res.redirect('/home');
      return;
    }
    next();
  });

  app.route('/login')
    .get(index)
    .post(submit);
};
