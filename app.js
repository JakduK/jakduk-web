'use strict';

var app = require('express')();
require('./config/express')(app);
module.exports = app;
