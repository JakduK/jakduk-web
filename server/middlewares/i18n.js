const path = require('path');
const config = require('../config/environment');
const locale = config.locale;
const i18n = require('i18n');
const moment = require('moment');

i18n.configure({
  defaultLocale: locale.default,
  locales: locale.list,
  directory: path.join(__dirname, '..', '..', 'i18n'),
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

    req.locale = userLocale;
    res.locals.locale = userLocale;
    res.cookie('lang', userLocale);

    bindRenderProxy(req, res);

    next();
  }
};

function bindRenderProxy (req, res) {
  var orgRender = res.render;
  res.render = function () {
    i18n.setLocale(req.locale);
    moment.locale(req.locale);
    orgRender.apply(this, arguments);
  }.bind(res)
}