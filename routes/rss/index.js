module.exports.setup = function (app) {
  app.get('/rss', function (req, res, next) {
    req.api.rss().then(response => {
      res.set('content-type', 'application/rss+xml');
      res.send(response.data);
    }).catch(next);
  });
};