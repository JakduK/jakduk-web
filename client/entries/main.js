import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import PostRegdate from '../filters/post_regdate';
import Encode from '../filters/encode';
import Tooltip from '../directives/tooltip';
import App from '../components/app/app';
import '../components/navbar/navbar';
import '../components/sidenav/sidenav';
import '../components/phone_sidenav/phone_sidenav';
import routeConfig from './route';

init();

function init() {
  Vue.directive('tooltip', Tooltip);
  Vue.filter('postRegDate', PostRegdate);
  Vue.filter('encode', Encode);

  Vue.use(VueRouter);
  Vue.use(VueI18n);
  Vue.use(Vuex);

  Vue.mixin({
    methods: {
      src(src) {
        return `${src}?${window.ENV.revision}`;
      }
    }
  });

  $.when(
    loadI18nBundle(window.ENV.locale),
    loadMomentLocale(window.ENV.locale)
  ).done(i18nBundle => {
    Vue.config.lang = window.ENV.locale;
    Vue.config.fallbackLang = 'en';
    Vue.locale(window.ENV.locale, i18nBundle);

    const store = new Vuex.Store({
      state: {
        isAuthenticated: !!window.ENV.profile,
        profile: window.ENV.profile,
        notification: {
          list: []
        },
        loading: true
      },
      mutations: {
        load(state, b) {
          state.loading = b;
        }
      }
    });

    const router = new VueRouter(routeConfig);

    /* eslint-disable no-new */
    const app = new Vue({
      store,
      router,
      render: h => h(App)
    });

    app.$mount('#root');
  });
}

function loadI18nBundle(locale) {
  const deferred = $.Deferred();
  require(`bundle-loader!../../assets/i18n/${locale}.json`)(bundle => {
    deferred.resolve(bundle);
  });
  return deferred;
}

function loadMomentLocale(locale) {
  const deferred = $.Deferred();
  if (locale === 'en') {
    deferred.resolve();
  } else {
    require(`bundle-loader!../../node_modules/moment/locale/${locale}.js`)(() => {
      deferred.resolve();
    });
  }
}
