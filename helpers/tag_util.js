'use strict';

var _ = require('lodash');
var HtmlParser = require('html-parser-lite').RawHtmlParser;

module.exports = {
  ogFrom: function (html, limit) {
    var og = {
      description: ''
    };
    new HtmlParser({
      scanner: {
        startElement: function (tagName, attrs) {
          if (!og.image && tagName === 'img') {
            og.image = attrs.src;
          }
        },
        characters: function (text) {
          if (og.description.length <= limit) {
            og.description += text.trim();
          }
        },
        endElement: function (tagName) {},
        comment: function (text) {}
      }
    }).parse(html);

    return og;
  }
};
