module.exports = function (app) {
  // require('./home').setup(app);
  require('./join').setup(app);
  require('./password').setup(app);
  require('./login').setup(app);
  require('./auth_3rd').setup(app);
  require('./logout').setup(app);
  require('./user').setup(app);
  // require('./board').setup(app);
  require('./about').setup(app);
  // require('./gallery').setup(app);
  // require('./jakdu').setup(app);
  // require('./stats').setup(app);
  // require('./search').setup(app);
  require('./admin').setup(app);
  require('./rss').setup(app);
  // require('./error').setup(app);
};
