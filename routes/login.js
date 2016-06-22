var login = require('../controllers/login');

function setup(app) {
  app.get('/login', login.default['get']);
  app.post('/login', login.default['post']);
  app.get('/join', login.join['get']);
  app.post('/join', login.join['post']);
  app.post('/password', login.password);
  app.post('/password/find', login.findPassword);
}

module.exports = setup;