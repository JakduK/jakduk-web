'use strict';

const moment = require('moment');
const i18n = require('i18n');

module.exports.setup = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/home');
  });

  app.get('/home', function (req, res, next) {
    Promise.all([
      req.api.latest(),
      req.api.encyclopedia(res.locals.locale),
      req.api.getPopularSearchWords({
        size: 20
      })
    ]).then(responses => {
      res.render('home/home', {
        title: [
          i18n.__('common.home'),
          i18n.__('common.jakduk')
        ],
        todayDate: moment(new Date().setHours(0, 0, 0, 0)).valueOf(),
        data: {
          posts: responses[0].data.posts || [],
          users: responses[0].data.users || [],
          comments: responses[0].data.comments || [],
          galleries: responses[0].data.galleries || [],
          homeDescription: responses[0].data.homeDescription || {},
          encyclopedia: responses[1].data || {},
          popularSearchWords: responses[2].data.popularSearchWords || {},
        }
      });
    }).catch(next);
  });
};
