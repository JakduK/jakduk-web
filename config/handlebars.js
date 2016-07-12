var path = require('path');
var hbs = require('hbs');
var hbsUtils = require('hbs-utils')(hbs);
var i18n = require('i18n');
var moment = require('moment');

hbs.registerHelper('TITLE', function(val) {
  var TRANSLATION = hbs.handlebars.helpers.TRANSLATION;
  var arrVal = [].concat(val);
  return arrVal.reduce(function(prev, each) {
    return prev + ' &middot; ' + TRANSLATION(each);
  }, TRANSLATION(arrVal.shift()));
});

hbs.registerHelper('TRANSLATION', function(key) {
  return i18n.__(key);
});

hbs.registerHelper('EQ', function(val1, val2) {
  return val1 === val2;
});

hbs.registerHelper('NOT_EQ', function(val1, val2) {
  return val1 !== val2;
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
  return JSON.stringify(val||{}).replace(/\\/g, '\\\\');
});

hbs.registerHelper('DATE_FORMAT', function(val, format) {
  return moment(val).format(format);
});

hbs.registerHelper('GET_PROP', function(obj, key) {
  return obj[key];
});

hbs.registerHelper('DATE_BY_ID', function(id) {
  return new Date(parseInt(id.substring(0, 8), 16) * 1000);
});

if (process.env.NODE_ENV === 'development') {
  hbsUtils.registerWatchedPartials(path.join(__dirname, '..', 'views', 'include'));
} else {
  hbs.registerPartials(path.join(__dirname, '..', 'views', 'include'));
}

module.exports = function(app) {
  app.set('view engine', 'hbs');
  app.set('engine', hbs.__express);
};