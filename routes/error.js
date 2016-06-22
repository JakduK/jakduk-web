var error = require('../controllers/error');
var config = require('../config/environment');

function setup(app) {
  app.use(error.notFound);

  if (config.env === 'development') {
    app.use(error.serverError['dev']);
  }

  app.use(error.serverError['prod']);
}

module.exports = setup;
