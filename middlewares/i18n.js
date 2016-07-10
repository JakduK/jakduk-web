'use strict';

var path = require('path');
var config = require('../config/environment');
var locale = config.locale;
var i18n = require('i18n');

i18n.configure({
  defaultLocale: locale.default,
  locales: locale.list,
  directory: path.join(__dirname, '..', 'i18n'),
  extension: '.json'
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    var userLocale = req.query.lang || req.acceptsLanguages(locale.list);
    if (!locale.alias[userLocale]) {
      userLocale = locale.alias[userLocale.replace('_', '-').split('-')[0] + '-*'] || userLocale.default;
    }
    i18n.setLocale(userLocale);
    req.locale = userLocale;
    res.locals.locale = userLocale;
    next();
  });
};