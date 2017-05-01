var path = require('path');
var hbs = require('hbs');
var handlebars = hbs.handlebars;
var hbsUtils = require('hbs-utils')(hbs);
var i18n = require('i18n');
var filesize = require('filesize');
var _ = require('lodash');
var moment = require('moment');

hbs.registerHelper('TITLE', function(val) {
  var arrVal = [].concat(val);
  var first = arrVal.shift();
  return arrVal.reduce(function(prev, each) {
    return prev + ' &middot; ' + each;
  }, first);
});

hbs.registerHelper('TRANSLATION', function(key, options) {
  return new handlebars.SafeString(i18n.__(key, options.hash));
});

hbs.registerHelper('TRUNCATE', function(val, options) {
  return _.truncate(val, {
    length: options.hash.size
  });
});

hbs.registerHelper('ADD', function() {
  return _(arguments).slice(0, arguments.length - 1).reduce(function (prev, curr) {
    return prev + curr;
  });
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

hbs.registerHelper('TERNARY', function(cond, val1, val2) {
  return cond ? val1 : val2;
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
  return JSON.stringify(val);
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

hbs.registerHelper('DATE_FORMAT', function(val, format) {
  return moment(val).format(format);
});

hbs.registerHelper('ARRAY_SIZE', function(val) {
  return (val || []).length;
});

hbs.registerHelper('CONCAT', function() {
  return Array.prototype.slice.call(arguments, 0, arguments.length - 1).join('');
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

hbs.registerHelper('LOWERCASE', function(val) {
  return (val || '').toLowerCase();
});

hbs.registerHelper('SUMMERNOTE_LOCALE', function(locale) {
  return locale.startsWith('ko') ? 'ko-KR' : '';
});

hbs.registerHelper('SHORT_LOCALE', function(locale) {
  return locale.replace('-', '_').split('_')[0];
});

hbs.registerHelper('PARTIAL', function(name, options) {
  if (!this.$INJECT) {
    this.$INJECT = {};
  }
  if (!this.$INJECT[name]) {
    this.$INJECT[name] = [];
  }
  this.$INJECT[name].push(options.fn(this));
  return null;
});

hbs.registerHelper('CHUNK', hbs.handlebars.helpers.PARTIAL);

hbs.registerHelper('INJECT', function(name) {
  return this.$INJECT && this.$INJECT[name] && this.$INJECT[name].join('');
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
