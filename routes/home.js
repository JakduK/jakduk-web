var HomeController = require('../controllers/home');

function setup(app) {
  var homeController = new HomeController(app);
  homeController.default('/home');
}

module.exports = setup;
