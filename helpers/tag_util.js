'use strict';

var _ = require('lodash');
var HtmlParser = require('html-parser-lite').RawHtmlParser;

module.exports = {
  ogFrom: function (html, limit) {
    var og = {};
    var imageUrl;
    var description = [];

    new HtmlParser({
      scanner: {
        startElement: function (tagName, attrs) {
          if (!imageUrl && tagName === 'img') {
            imageUrl = attrs.src;
          }
        },
        characters: function (text) {
          var partial = text.trim().replace(/&[^;]+;/g, ' ').replace(/&/g, '');
          if (partial) {
            description.push(partial);
          }
        },
        endElement: function (tagName) {},
        comment: function (text) {}
      }
    }).parse(html);

    if (imageUrl) {
      og.image = imageUrl;
    }

    if (description.length) {
      og.description = '';
       _.each(description, function (partial) {
         if (og.description.length + partial.length < limit) {
           og.description += partial;
         } else {
           og.description += partial.slice(0, limit - og.description.length);
           return false;
         }
      });
      if (og.description.length === limit) {
        og.description = og.description.slice(0, limit - 3) + '...';
      }
    }

    return og;
  }
};
