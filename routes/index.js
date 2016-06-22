module.exports = function(app) {
  app.get('/', function(req, res) {
    res.redirect('/home');
  });

  require('./home')(app);
  require('./login')(app);
  require('./error')(app);
};