'use strict';

define([
  'app',
  'jquery',
  'bootstrap',
  'mCustomScrollbar',
  'smoothScroll',
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
  $(document).ready(function() {
    App.init();
    App.initScrollBar();
  });
});