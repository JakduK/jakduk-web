const path = require('path');
const config = require('../config/environment');
const locale = config.locale;
const i18n = require('i18n');
const moment = require('moment');
const _ = require('lodash');

i18n.configure({
  defaultLocale: locale.default,
  locales: locale.list,
  directory: path.resolve('assets', 'i18n'),
  extension: '.json',
  autoReload: true,
  updateFiles: false
});

module.exports = function () {
  return function i18nInit(req, res, next) {
    let userLocale = _.isArray(req.query.lang) ? req.query.lang[0] : req.query.lang;

    if (!userLocale) {
      userLocale = req.cookies.lang;
    }

    if (!userLocale) {
      userLocale = req.acceptsLanguages(locale.list);
    }

    if (!userLocale) {
      userLocale = locale.default;
    }

    userLocale = userLocale.replace('_', '-');

    if (!locale.alias[userLocale]) {
      userLocale = locale.alias[`${userLocale.split('-')[0]}-*`] || userLocale.default;
    }

    req.locale = res.locals.locale = userLocale;
    res.cookie('lang', userLocale.replace('-', '_'));

    bindLibs(req, res);

    next();
  };
};

function bindLibs(req, res) {
  const orgRender = res.render;
  const locale = req.locale;
  res.render = function () {
    i18n.setLocale(locale);
    moment.locale(locale);
    orgRender.apply(this, arguments);
  }.bind(res);
}
