import Vue from 'vue';
import Encode from '../filters/encode';
import Tooltip from '../directives/tooltip';
import router from './router';
import store from './store';
import {load as loadApp} from './i18n';
import App from '../components/app/app.vue';
import Navbar from '../components/navbar/navbar.vue';
import PhoneSidenav from '../components/phone_sidenav/phone_sidenav.vue';

Vue.directive('tooltip', Tooltip);
Vue.filter('encode', Encode);

Vue.mixin({
  methods: {
    isEmptyArray(arr) {
      return !arr || !arr.length;
    }
  }
});

loadApp(window.ENV.locale).done(() => {
  const navbar = new Vue({
    store,
    router,
    render: h => h(Navbar)
  });

  const main = new Vue({
    store,
    router,
    render: h => h(App)
  });

  const phoneSidenav = new Vue({
    store,
    router,
    render: h => h(PhoneSidenav)
  });

  navbar.$mount('#navbar');
  main.$mount('#main');
  phoneSidenav.$mount('#phoneSidenav');
});
