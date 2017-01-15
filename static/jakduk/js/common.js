'use strict';

define([
  'app',
  'jquery',
  'bootstrap',
  'mCustomScrollbar',
  'angular',
  'angular-cookies',
  'angular-locale',
  'angular-sanitize',
  'angular-animate',
  'angular-touch',
  'angular-lazy-img',
  'angular-loading-bar',
  'angular-ui-bootstrap',
  'angular-ladda'
], function () {
  $(function() {
    App.init();
    App.initScrollBar();
  });
});