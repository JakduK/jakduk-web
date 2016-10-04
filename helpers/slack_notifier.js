'use strict';

var debug = require('debug')('jakduk:slack');
var restler = require('restler');
var clor = require('clor');

module.exports = function(options) {
  return function (message) {
    restler.post(options.webhook, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'payload=' + JSON.stringify({
        channel: options.channel,
        attachments: [{
          pretext: (message.isPost ? 'Posted' : 'Commented') + ' by ' + '*' + message.author + '*',
          title: message.subject,
          title_link: message.link,
          text: message.text,
          image_url: message.image,
          fallback: message.subject,
          mrkdwn_in: [
            'pretext'
          ]
        }]
      })
    }).on('complete', function (data, response) {
      debug('%o', data, clor.yellow(response.statusCode).toString(), clor.red(message.link).toString());
    });
  };
};
