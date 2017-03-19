import Vue from 'vue';
import Encode from '../filters/encode';
import Tooltip from '../directives/tooltip';
import router from './router';
import store from './store';
import {load as loadI18n} from './i18n';
import App from '../components/app/app.vue';
import Navbar from '../components/navbar/navbar.vue';
import PhoneSidenav from '../components/phone_sidenav/phone_sidenav.vue';
import Toast from '../components/toast/toast.vue';

Vue.component('toast', Toast);
Vue.directive('tooltip', Tooltip);
Vue.filter('encode', Encode);

Vue.mixin({
  methods: {
    isEmptyArray(arr) {
      return !arr || !arr.length;
    }
  }
});

loadI18n(window.ENV.locale).done(() => {
  router.beforeEach((to, from, next) => {
    if (!store.state.isAuthenticated && to.matched.some(record => record.meta.requiresAuth)) {
      if (window.confirm(Vue.t('common.do.you.want.to.login'))) {
        window.location = `/login?redir=${encodeURIComponent(to.fullPath)}`;
      } else {
        next(false);
      }
    } else {
      next();
    }
  });

  startApp();
});

function startApp() {
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
}
