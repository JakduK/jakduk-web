var path = require('path');
var hbs = require('hbs');
var hbsUtils = require('hbs-utils')(hbs);
var i18n = require('i18n');
var filesize = require('filesize');
var _ = require('lodash');
var moment = require('moment');

hbs.registerHelper('TITLE', function(val, options) {
  var TRANSLATION = hbs.handlebars.helpers.TRANSLATION;
  var arrVal = [].concat(val);
  return arrVal.reduce(function(prev, each) {
    return prev + ' &middot; ' + TRANSLATION(each, options);
  }, TRANSLATION(arrVal.shift(), options));
});

hbs.registerHelper('TRANSLATION', function(key, options) {
  return i18n.__(key, options.hash);
});

hbs.registerHelper('EQ', function(val1, val2) {
  return val1 === val2;
});

hbs.registerHelper('NOT_EQ', function(val1, val2) {
  return val1 !== val2;
});

hbs.registerHelper('NOT', function(val) {
  return !val;
});

hbs.registerHelper('OR', function() {
  var val = arguments[0];
  var others = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
  return others.some(function (elem) {
    return val === elem;
  });
});

hbs.registerHelper('OPR', function(operator, v1, v2) {
  switch (operator) {
    case '===':
      return v1 === v2;
    case '!==':
      return v1 !== v2;
    case '<':
      return v1 < v2;
    case '<=':
      return v1 <= v2;
    case '>':
      return v1 > v2;
    case '>=':
      return v1 >= v2;
    case '&&':
      return v1 && v2;
    case '||':
      return v1 || v2;
    default:
      return false;
  }
});

hbs.registerHelper('JSON_STRINGIFY', function(val) {
  return val ? JSON.stringify(val).replace(/\\/g, '\\\\') : '';
});

hbs.registerHelper('GET_PROP', function(obj, key) {
  return obj[key];
});

hbs.registerHelper('DATE_BY_ID', function(id) {
  return new Date(parseInt(id.substring(0, 8), 16) * 1000).getTime();
});

hbs.registerHelper('SIZE_FORMAT', function(val) {
  return filesize(val);
});

hbs.registerHelper('DATE_FORMAT', function(val, format, locale) {
  moment.locale(locale);
  return moment(val).format(format);
});

hbs.registerHelper('ARRAY_SIZE', function(val) {
  return (val || []).length;
});

hbs.registerHelper('CONCAT', function() {
  return Array.prototype.join.call(arguments, '');
});

hbs.registerHelper('CATEGORY_NAME', function(category, locale) {
  return (_.find((category || {}).names || [], function (name) {
    return name.language.startsWith(locale);
  }) || {name: ''}).name || '';
});

hbs.registerHelper('PICK_CATEGORY', function(categories, code) {
  return _.find(categories, function (category) {
    return category.code === code;
  });
});

hbs.registerHelper('DEFAULT_VALUE', function(val1, val2) {
  return val1 || val2;
});

hbs.registerHelper('SUMMERNOTE_LOCALE', function(locale) {
  return locale.startsWith('ko') ? 'ko-KR' : 'en-US';
});

if (process.env.NODE_ENV !== 'production') {
  hbsUtils.registerWatchedPartials(path.join(__dirname, '..', 'views', 'include'));
} else {
  hbs.registerPartials(path.join(__dirname, '..', 'views', 'include'));
}

module.exports = function(app) {
  app.set('view engine', 'hbs');
  app.set('engine', hbs.__express);
};
