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
    imageSrc(id) {
      return typeof id !== 'number' && !id ? '' : `${window.ENV.imageServerUrl}/gallery/${id}`;
    },
    thumbnailSrc(id) {
      return typeof id !== 'number' && !id ? '' : `${window.ENV.imageServerUrl}/gallery/thumbnail/${id}`;
    },
    avatarSrc(src) {
      return src ? src.smallPictureUrl : '/assets/images/default_avatar.png';
    },
    isEmptyArray(arr) {
      return !arr || !arr.length;
    },
    lastElement(arr) {
      return arr[arr.length - 1];
    }
  }
});

if (!window.location.origin) {
  window.location.origin = `${window.location.protocol}//${window.location.host}`;
}

loadI18n(window.ENV.locale).done(() => {
  router.beforeEach((to, from, next) => {
    store.commit('load', true);

    if (!store.state.isAuthenticated && to.matched.some(record => record.meta.requiresAuth)) {
      if (window.confirm(Vue.t('common.do.you.want.to.login'))) {
        window.location = `/login?redir=${encodeURIComponent(to.fullPath)}`;
      } else {
        next(false);
        store.commit('load', false);
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
    render: createElement => createElement(Navbar)
  });

  const main = new Vue({
    store,
    router,
    render: createElement => createElement(App)
  });

  const phoneSidenav = new Vue({
    store,
    router,
    render: createElement => createElement(PhoneSidenav)
  });

  navbar.$mount('#navbar');
  main.$mount('#main');
  phoneSidenav.$mount('#phoneSidenav');
}
