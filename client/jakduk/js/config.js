'use strict';

require.config({
  paths: {
    angular: '/assets/angular/angular',
    'angular-sanitize': '/assets/angular-sanitize/angular-sanitize.min',
    'angular-slick': '/assets/angular-slick-carousel/dist/angular-slick.min',
    'angular-animate': '/assets/angular-animate/angular-animate.min',
    'angular-ui-bootstrap': '/assets/angular-ui-bootstrap/dist/ui-bootstrap-tpls',
    'angular-ui-router': '/assets/angular-ui-router/release/angular-ui-router.min',
    'angular-ladda': '/assets/angular-ladda/dist/angular-ladda.min',
    'angular-touch': '/assets/angular-touch/angular-touch.min',
    'angular-cookies': '/assets/angular-cookies/angular-cookies.min',
    jquery: '/assets/jquery/dist/jquery.min',
    bootstrap: '/assets/bootstrap/dist/js/bootstrap.min',
    ladda: '/assets/unify/assets/plugins/ladda-buttons/js/ladda.min',
    spin: '/assets/unify/assets/plugins/ladda-buttons/js/spin.min',
    admin: '/assets/jakduk/js/admin',
    common: '/assets/jakduk/js/common',
    jakduk: '/assets/jakduk/js/jakduk'
  },
  shim: {
    bootstrap: {
      deps: ['jquery']
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
    'angular-ui-bootstrap': {
      deps: ['bootstrap', 'angular']
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'angular-touch': {
      deps: ['angular']
    },
    'angular-cookies': {
      deps: ['angular']
    }
  }
});
