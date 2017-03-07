import Vue from 'vue';
import $ from 'jquery';
import '../search_input/search_input';

export default Vue.component('phone-sidenav', {
  template: require('./phone_sidenav.html'),
  data() {
    return {
      path: window.location.pathname
    };
  },
  mounted() {
    const $el = $(this.$el);
    $el.accordion();

    $el.sidebar('setting', 'transition', 'overlay').sidebar('attach events', '#phoneSidenav a.item');
  },
  watch: {
    $route(to, from) {
      const langQueryRegexp = /lang=(.[^&]+)/g;
      if (to.fullPath.match(langQueryRegexp)) {
        this.path = to.fullPath.replace(langQueryRegexp, () => '');
      } else {
        this.path = `${to.fullPath}${to.fullPath.lastIndexOf('?') !== -1 ? '&' : '?'}`;
      }
    }
  },
  methods: {
    changeLocale(locale) {
      const langQueryRegexp = /lang=(.[^&]+)/g;
      if (window.location.href.match(langQueryRegexp)) {
        return window.location.href.replace(langQueryRegexp, () => `lang=${locale}`);
      } else {
        return `${window.location.href}?lang=${locale}`;
      }
    }
  }
});
