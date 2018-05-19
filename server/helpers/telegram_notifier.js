const debug = require('debug')('jakduk-web:telegram');
const restler = require('restler');
const clor = require('clor');

module.exports = function (options) {
  const apiBase = `https://api.telegram.org/bot${options.token}`;
  return function (message) {
    const content = [
      `🔔 <strong>New ${message.isPost ? 'Post' : 'Comment'}!</strong> - by ${message.author}`,
      ''
    ];

    content.push(message.text, '', `<strong>${message.subject}</strong>`);

    if (message.video) {
      content.push(`<a href="${message.video}">Watch on ${message.videoProvider}</a>`);
    }

    content.push(`<a href="${message.link}">${message.link}</a>`);

    restler.postJson(`${apiBase}/sendMessage`, {
      chat_id: options.chat_id,
      text: content.join('\n'),
      parse_mode: 'html'
    }).on('complete', (data, response) => {
      if (response) {
        debug('%o', response.statusCode, JSON.stringify(message), JSON.stringify(data));
      }
    }).on('error', err => {
      debug('%o', err.code, clor.red(err.message), err.stack);
    });
  };
};

