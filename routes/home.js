var home = require('../controllers/home');
var auth = require('../middlewares/auth');

function setup(app) {
  auth(app, '/home');
  app.get('/home', home.default);
}

module.exports = setup;
