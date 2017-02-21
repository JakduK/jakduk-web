import Vue from 'vue';
import {mapState} from 'vuex';
import './profile_menu';
import '../search_input/search_input';

Vue.component('navbar', {
  template: require('./navbar.html'),
  mounted() {
    const $el = $(this.$el);

    $el.find('.logon.item').each((index, item) => {
      $(item).popup({
        popup: $(item).find('.popup'),
        position: 'bottom right',
        on: 'click'
      });
    });

    $el.find('#btnSidebarToggle').click(() => {
      $('.ui.sidebar').sidebar('setting', {
        transition: 'overlay'
      }).sidebar('toggle');
    });
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
  },
  computed: mapState(['isAuthenticated'])
});
