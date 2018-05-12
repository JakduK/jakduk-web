'use strict';

var debug = require('debug')('jakduk-web:slack');
var restler = require('restler');
var clor = require('clor');

module.exports = function (options) {
  return function (message) {
    let attachments = [{
      pretext: (message.isPost ? 'Posted' : 'Commented') + ' by ' + '*' + message.author + '*',
      title: message.subject,
      title_link: message.link,
      text: message.text,
      image_url: message.image,
      fallback: message.subject,
      color: "#439FE0",
      mrkdwn_in: [
        'pretext'
      ]
    }];

    if (message.video) {
      attachments.push({
        text: '<' + message.video + '>',
        unfurl_links: true,
        color: "#439FE0",
        fields: [{
          title: message.videoProvider
        }]
      });
    }

    restler.post(options.webhook, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'payload=' + JSON.stringify({
        channel: options.channel,
        attachments: attachments
      })
    }).on('complete', (data, response) => {
      debug('%o', data, clor.yellow(response.statusCode).toString(), clor.red(message.link).toString());
    });
  };
};
