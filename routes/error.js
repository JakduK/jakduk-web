var ErrorController = require('../controllers/error');
var config = require('../config/environment');

function setup(app) {
  var errorController = new ErrorController(app);
  errorController.notFound('/');
  errorController.all('/');
}

module.exports = setup;
