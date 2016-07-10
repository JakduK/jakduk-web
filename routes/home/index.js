'use strict';

module.exports.setup = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/home');
  });

  app.get('/home', function (req, res, next) {
    Promise.all([
      req.api.latest(),
      req.api.encyclopedia(res.locals.locale)
    ]).then(function (responses) {
      var datas = responses.map(function (response) {
        return response.data
      });
      res.render('home/home', {
        'head_page': 'head_home',
        timeNow: Date.now(),
        data: {
          posts: datas[0].posts || [],
          users: datas[0].users || [],
          comments: datas[0].comments || [],
          galleries: datas[0].galleries || [],
          homeDescription: datas[0].homeDescription || {},
          encyclopedia: datas[1]
        }
      });
    }).catch(function (err) {
      next(err);
    });
  });
};
