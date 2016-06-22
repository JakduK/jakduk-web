var path = require('path');
var hbs = require('hbs');
var hbsUtils = require('hbs-utils')(hbs);
var i18n = require('i18n');

hbs.registerHelper('TRANSLATION', function(key) {
  return new hbs.SafeString(i18n.__(key));
});

hbs.registerHelper('EQ', function(val1, val2) {
  return val1 === val2;
});

hbs.registerHelper('OR', function() {
  var val = arguments[0];
  var others = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
  for (var i = 0; i < others.length; i++) {
    if (val === others) {
      return true;
    }
  }
  return false;
});

hbs.registerHelper('FROM_JSON', function(val) {
  return JSON.stringify(val).replace(/\\/g, '\\\\');
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