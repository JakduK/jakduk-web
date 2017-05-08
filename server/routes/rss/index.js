module.exports.setup = function (app) {
  app.get('/rss.xml', (req, res, next) => {
    req.api.rss().then(response => {
      res.set('content-type', 'application/rss+xml');
      res.send(response.data);
    }).catch(next);
  });

  app.get('/sitemap.xml', (req, res, next) => {
    req.api.sitemap().then(response => {
      res.set('content-type', 'application/xml');
      res.send(response.data);
    }).catch(next);
  });
};
