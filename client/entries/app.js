import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import moment from 'moment';
import jQuery from 'jquery';
import postRegdate from '../filters/post_regdate';
import encode from '../filters/encode';
import tooltip from '../directives/tooltip';
import '../components/navbar/navbar';
import '../components/sidenav/sidenav';
import '../components/phone_sidenav/phone_sidenav';

window.moment = moment;
window.$ = jQuery;

Vue.directive('tooltip', tooltip);
Vue.filter('postRegDate', postRegdate);
Vue.filter('namedColor', encode);

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(Vuex);

Vue.config.lang = window.ENV.locale;
Vue.config.fallbackLang = 'en';
Vue.locale(window.ENV.locale, window.ENV.i18n);

const store = new Vuex.Store({
  state: {
    isAuthenticated: !!window.ENV.profile,
    profile: window.ENV.profile,
    notification: {
      list: []
    }
  }
});

const routes = [{
  path: '/',
  redirect: 'home',
  component: {
    template: require('./with_sidenav.html')
  },
  children: [{
    path: 'home',
    component (resolve) {
      require.ensure(['../entries/home/home'], () => {
        resolve(require('../entries/home/home'));
      }, 'home');
    }
  }, {
    path: 'board'
  }]
}];

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  el: '#root',
  template: require('./app.html'),
  store,
  router
});