module.exports = function (app) {
  require('./home').setup(app);
  require('./join').setup(app);
  require('./password').setup(app);
  require('./login').setup(app);
  require('./auth_3rd').setup(app);
  require('./logout').setup(app);
  require('./board').setup(app);
  require('./about').setup(app);
  require('./error').setup(app);
};