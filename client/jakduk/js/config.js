'use strict';

require.config({
  paths: {
    kakao: '//developers.kakao.com/sdk/js/kakao.min',
    ladda: '/static/unify/assets/plugins/ladda-buttons/js/ladda.min',
    spin: '/static/unify/assets/plugins/ladda-buttons/js/spin.min',
    jquery: '/static/bower_components/jquery/dist/jquery.min',
    bootstrap: '/static/bower_components/bootstrap/dist/js/bootstrap.min',
    'back-to-top': '/static/unify/assets/plugins/back-to-top',
    mCustomScrollbar: '/static/unify/assets/plugins/scrollbar/js/jquery.mCustomScrollbar.concat.min',
    slick: '/static/bower_components/slick-carousel/slick/slick.min',
    app: '/static/unify/assets/js/app',
    summernote: '/static/bower_components/summernote/dist/summernote.min',
    highcharts: '/static/bower_components/highcharts/highcharts',
    'highcharts-export': '/static/bower_components/highcharts/modules/exporting',
    lightbox2: '/static/bower_components/lightbox2/dist/js/lightbox.min',
    angular: '/static/bower_components/angular/angular.min',
    'angular-sanitize': '/static/bower_components/angular-sanitize/angular-sanitize.min',
    'angular-slick': '/static/bower_components/angular-slick-carousel/dist/angular-slick.min',
    'angular-animate': '/static/bower_components/angular-animate/angular-animate.min',
    'angular-ui-bootstrap': '/static/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-ui-router': '/static/bower_components/angular-ui-router/release/angular-ui-router.min',
    'angular-summernote': '/static/bower_components/angular-summernote/dist/angular-summernote.min',
    'angular-infinite-scroll': '/static/bower_components/ngInfiniteScroll/build/ng-infinite-scroll',
    'angular-ladda': '/static/bower_components/angular-ladda/dist/angular-ladda.min',
    'angular-file-upload': '/static/bower_components/angular-file-upload/dist/angular-file-upload.min',
    'angular-lazy-img': '/static/bower_components/angular-lazy-img/release/angular-lazy-img.min',
    'angular-touch': '/static/bower_components/angular-touch/angular-touch.min',
    'angular-loading-bar': '/static/bower_components/angular-loading-bar/build/loading-bar.min',
    'angular-cookies': '/static/bower_components/angular-cookies/angular-cookies.min',
    'angular-highcharts': '/static/bower_components/highcharts-ng/dist/highcharts-ng.min',
    admin: '/static/jakduk/js/admin',
    common: '/static/jakduk/js/common',
    jakduk: '/static/jakduk/js/jakduk',
    semantic: '/static/semantic/dist/semantic',
    vue: '/static/node_modules/vue/dist/vue'
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
    app: {
      deps: ['jquery', 'mCustomScrollbar']
    },
    'lightbox2': {
      deps: ['jquery']
    },
    highcharts: {
      exports: 'highcharts'
    },
    'highcharts-export': {
      deps: ['highcharts'],
      exports: 'highcharts-export'
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
    'angular-loading-bar': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    },
    'angular-highcharts': {
      deps: ['angular', 'highcharts', 'highcharts-export'],
      exports: 'angular-highcharts'
    },
    'semantic': {
      deps: ['jquery']
    }
  }
});