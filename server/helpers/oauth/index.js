var config = require('../../config/environment');

module.exports = {
  facebook: require('./providers/facebook')(config.facebook),
  daum: require('./providers/daum')(config.daum)
};