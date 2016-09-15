'use strict';

require.config({
  paths: {
    kakao: '//developers.kakao.com/sdk/js/kakao.min',
    ladda: '/unify/assets/plugins/ladda-buttons/js/ladda.min',
    spin: '/unify/assets/plugins/ladda-buttons/js/spin.min',
    jquery: '/bower_components/jquery/dist/jquery.min',
    bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min',
    'back-to-top': '/unify/assets/plugins/back-to-top',
    mCustomScrollbar: '/unify/assets/plugins/scrollbar/js/jquery.mCustomScrollbar.concat.min',
    smoothScroll: '/unify/assets/plugins/smoothScroll',
    slick: '/bower_components/slick-carousel/slick/slick.min',
    app: '/unify/assets/js/app',
    summernote: '/bower_components/summernote/dist/summernote.min',
    highcharts: '/bower_components/highcharts/highcharts',
    'highcharts-export': '/bower_components/highcharts/modules/exporting',
    angular: '/bower_components/angular/angular.min',
    'angular-sanitize': '/bower_components/angular-sanitize/angular-sanitize.min',
    'angular-slick': '/bower_components/angular-slick-carousel/dist/angular-slick.min',
    'angular-animate': '/bower_components/angular-animate/angular-animate.min',
    'angular-ui-bootstrap': '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-ui-router': '/bower_components/angular-ui-router/release/angular-ui-router.min',
    'angular-summernote': '/bower_components/angular-summernote/dist/angular-summernote.min',
    'angular-infinite-scroll': '/bower_components/ng-infinite-scroller-origin/build/ng-infinite-scroll.min',
    'angular-ladda': '/bower_components/angular-ladda/dist/angular-ladda.min',
    'angular-file-upload': '/bower_components/angular-file-upload/dist/angular-file-upload.min',
    'angular-lazy-img': '/bower_components/angular-lazy-img/release/angular-lazy-img.min',
    'angular-touch': '/bower_components/angular-touch/angular-touch.min',
    'angular-bootstrap-lightbox': '/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min',
    'angular-loading-bar': '/bower_components/angular-loading-bar/build/loading-bar.min',
    'angular-cookies': '/bower_components/angular-cookies/angular-cookies.min',
    'angular-highcharts': '/bower_components/highcharts-ng/dist/highcharts-ng.min',
    admin: '/jakduk/js/admin',
    common: '/jakduk/js/common',
    jakduk: '/jakduk/js/jakduk'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
    },
    'back-to-top': {
      deps: ['jquery']
    },
    mCustomScrollbar: {
      deps: ['jquery']
    },
    smoothScroll: {
      deps: ['jquery']
    },
    app: {
      deps: ['jquery', 'mCustomScrollbar']
    },
    angular: {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angular-sanitize': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular-infinite-scroll': {
      deps: ['angular']
    },
    'angular-file-upload': {
      deps: ['angular']
    },
    'angular-slick': {
      deps: ['angular', 'slick']
    },
    'angular-ui-bootstrap': {
      deps: ['bootstrap', 'angular']
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'angular-summernote': {
      deps: ['summernote', 'angular']
    },
    'angular-lazy-img': {
      deps: ['angular']
    },
    'angular-touch': {
      deps: ['angular']
    },
    'angular-bootstrap-lightbox': {
      deps: ['angular']
    },
    'angular-loading-bar': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    },
    highcharts: {
      exports: 'highcharts'
    },
    'angular-highcharts': {
      deps: ['angular', 'highcharts', 'highcharts-export'],
      exports: 'angular-highcharts'
    },
    'highcharts-export': {
      deps: ['highcharts'],
      exports: 'highcharts-export'
    }
  }
});