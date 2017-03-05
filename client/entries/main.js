import Vue from 'vue';
import PostRegdate from '../filters/post_regdate';
import Encode from '../filters/encode';
import Tooltip from '../directives/tooltip';
import App from '../components/app/app';
import '../components/navbar/navbar';
import '../components/sidenav/sidenav';
import '../components/phone_sidenav/phone_sidenav';
import router from './router';
import store from './store';
import {load as loadApp} from './i18n';

Vue.directive('tooltip', Tooltip);
Vue.filter('postRegDate', PostRegdate);
Vue.filter('encode', Encode);

Vue.mixin({
  methods: {
    src(src) {
      return `${src}?${window.ENV.revision}`;
    }
  }
});

loadApp(window.ENV.locale).done(() => {
  const app = new Vue({
    store,
    router,
    render: h => h(App)
  });

  app.$mount('#root');
});
