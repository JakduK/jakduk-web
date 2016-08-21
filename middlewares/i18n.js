'use strict';

var path = require('path');
var config = require('../config/environment');
var locale = config.locale;
var i18n = require('i18n');
var moment = require('moment');

i18n.configure({
  defaultLocale: locale.default,
  locales: locale.list,
  directory: path.join(__dirname, '..', 'i18n'),
  extension: '.json',
  autoReload: true,
  updateFiles: false
});

module.exports = function () {
  return function i18nInit(req, res, next) {
    var userLocale = req.query.lang || req.cookies.lang || req.acceptsLanguages(locale.list);

    if (!locale.alias[userLocale]) {
      userLocale = locale.alias[userLocale.replace('_', '-').split('-')[0] + '-*'] || userLocale.default;
    }

    i18n.setLocale(userLocale);
    moment.locale(userLocale);

    req.locale = userLocale;
    res.locals.locale = userLocale;
    res.cookie('lang', userLocale);

    next();
  }
};
