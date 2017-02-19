import Vue from 'vue';
import '../search_input/search_input';

Vue.component('phone-sidenav', {
  template: require('./phone_sidenav.html'),
  mounted () {
    const $el = $(this.$el);
    $el.accordion();
  },
  methods: {
    changeLocale (locale) {
      return window.location.href.replace(/lang=(.[^&]+?)/g, () => `lang=${locale}`);
    }
  }
});
