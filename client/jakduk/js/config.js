'use strict';

require.config({
  paths: {
    kakao: '//developers.kakao.com/sdk/js/kakao.min',
    ladda: '/assets/unify/assets/plugins/ladda-buttons/js/ladda.min',
    spin: '/assets/unify/assets/plugins/ladda-buttons/js/spin.min',
    jquery: '/assets/bower_components/jquery/dist/jquery.min',
    bootstrap: '/assets/bower_components/bootstrap/dist/js/bootstrap.min',
    'back-to-top': '/assets/unify/assets/plugins/back-to-top',
    mCustomScrollbar: '/assets/unify/assets/plugins/scrollbar/js/jquery.mCustomScrollbar.concat.min',
    slick: '/assets/bower_components/slick-carousel/slick/slick.min',
    app: '/assets/unify/assets/js/app',
    summernote: '/assets/bower_components/summernote/dist/summernote.min',
    highcharts: '/assets/bower_components/highcharts/highcharts',
    'highcharts-export': '/assets/bower_components/highcharts/modules/exporting',
    lightbox2: '/assets/bower_components/lightbox2/dist/js/lightbox.min',
    angular: '/assets/bower_components/angular/angular.min',
    'angular-sanitize': '/assets/bower_components/angular-sanitize/angular-sanitize.min',
    'angular-slick': '/assets/bower_components/angular-slick-carousel/dist/angular-slick.min',
    'angular-animate': '/assets/bower_components/angular-animate/angular-animate.min',
    'angular-ui-bootstrap': '/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-ui-router': '/assets/bower_components/angular-ui-router/release/angular-ui-router.min',
    'angular-summernote': '/assets/bower_components/angular-summernote/dist/angular-summernote.min',
    'angular-infinite-scroll': '/assets/bower_components/ngInfiniteScroll/build/ng-infinite-scroll',
    'angular-ladda': '/assets/bower_components/angular-ladda/dist/angular-ladda.min',
    'angular-file-upload': '/assets/bower_components/angular-file-upload/dist/angular-file-upload.min',
    'angular-lazy-img': '/assets/bower_components/angular-lazy-img/release/angular-lazy-img.min',
    'angular-touch': '/assets/bower_components/angular-touch/angular-touch.min',
    'angular-loading-bar': '/assets/bower_components/angular-loading-bar/build/loading-bar.min',
    'angular-cookies': '/assets/bower_components/angular-cookies/angular-cookies.min',
    'angular-highcharts': '/assets/bower_components/highcharts-ng/dist/highcharts-ng.min',
    admin: '/assets/jakduk/js/admin',
    common: '/assets/jakduk/js/common',
    jakduk: '/assets/jakduk/js/jakduk',
    semantic: '/assets/semantic/dist/semantic',
    vue: '/assets/node_modules/vue/dist/vue'
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
