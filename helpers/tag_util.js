'use strict';

var _ = require('lodash');
var HtmlParser = require('html-parser-lite').RawHtmlParser;

module.exports = {
  ogFrom: function (html, limit) {
    var og = {};
    new HtmlParser({
      scanner: {
        startElement: function (tagName, attrs) {
          if (!og.image && tagName === 'img') {
            og.image = attrs.src;
          }
        },
        characters: function (text) {
          var partial = text.trim();
          if (partial) {
            if (!og.description) {
              og.description = partial;
            } else if (partial && og.description.length <= limit) {
              og.description += partial;
            }
          }
        },
        endElement: function (tagName) {},
        comment: function (text) {}
      }
    }).parse(html);

    return og;
  }
};
