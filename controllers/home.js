'use strict';

var rest = require('../util/rest');

function home(req, res, next) {
  Promise.all([
    new Promise(function (resolve) {
      rest.latest(function (data) {
        resolve(data);
      });
    }),
    new Promise(function (resolve) {
      rest.encyclopedia({
        parameters: {lang: res.locals.locale}
      }, function (data) {
        resolve(data);
      });
    })
  ]).then(function (datas) {
    res.render('home/home', {
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
  }).catch(function(err) {
    next(err);
  });
}

module.exports = {
  default: home
};
