import Vue from 'vue';
import $ from 'jquery';
import '../search_input/search_input';

export default Vue.component('phone-sidenav', {
  template: require('./phone_sidenav.html'),
  mounted() {
    const $el = $(this.$el);
    $el.accordion();
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
