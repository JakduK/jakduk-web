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
          pretext: message.author,
          title: message.subject,
          title_link: message.link,
          text: message.text,
          image_url: message.image,
          fallback: message.subject
        }]
      })
    }).on('complete', function (data) {
      debug(data, env);
    });
  };
};
