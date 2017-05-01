const express = require('express');
const i18n = require('i18n');
const config = require('../../config/environment');

function index(req, res) {
  res.render('login/password_reset', {
    title: [
      i18n.__('user.msg.reset.your.password.title'),
      i18n.__('common.jakduk')
    ]
  });
}

function indexFindPassword(req, res) {
  res.render('login/password_find', {
    title: [
      i18n.__('user.msg.find.your.password.title'),
      i18n.__('common.jakduk')
    ]
  });
}

function submitFindPassword(req, res, next) {
  req.api.findPassword(req.body.email, `${config.origin}/password/reset`).then(response => {
    const data = response.data;

    res.render('login/password_find_message', {
      title: [
        i18n.__('user.msg.find.your.password.title'),
        i18n.__('common.jakduk')
      ],
      subject: data.subject,
      message: data.message
    });
  }).catch(next);
}

function indexResetPassword(req, res, next) {
  req.api.checkResetPasswordCode(req.params.code).then(response => {
    if (response.statusCode === 200) {
      res.render('login/password_reset', {
        title: [
          i18n.__('user.msg.reset.your.password.title'),
          i18n.__('common.jakduk')
        ],
        message: response.data.message,
        code: req.params.code
      });
    } else {
      res.render('login/password_find_message', {
        title: [
          i18n.__('user.msg.find.your.password.title'),
          i18n.__('common.jakduk')
        ],
        message: response.data.message
      });
    }
  }).catch(function (err) {
    next(err);
  });
}

function submitResetPassword(req, res, next) {
  req.api.resetPassword(req.body.code, req.body.password).then(response => {
    const data = response.data;

    res.render('login/password_find_message', {
      title: [
        i18n.__('user.msg.find.your.password.title'),
        i18n.__('common.jakduk')
      ],
      subject: data.subject,
      message: data.message
    });
  }).catch(next);
}

module.exports.setup = function (app) {
  const router = express.Router();

  router.use('/', (req, res, next) => {
    if (req.isAuthenticated) {
      res.redirect('back');
      return;
    }
    next();
  });

  router.get('/', index);

  router.get('/find', indexFindPassword);
  router.post('/find', submitFindPassword);

  router.get('/reset/:code', indexResetPassword);
  router.post('/reset', submitResetPassword);

  app.use('/password', router);
};
