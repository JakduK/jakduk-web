'use strict';

var debug = require('debug')('slack');
var restler = require('restler');

module.exports = function(options, env) {
  return function (message) {
    restler.post(options.webhook, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'payload=' + JSON.stringify({
        channel: options.channel,
        attachments: [{
          pretext: options.author,
          title: message.subject,
          title_link: message.link,
          text: message.text,
          fallback: message.subject,
          image_url: message.image
        }]
      })
    }).on('complete', function (data) {
      debug(data, env);
    });
  };
};
