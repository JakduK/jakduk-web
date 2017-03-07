import Vue from 'vue';
import $ from 'jquery';
import {mapState} from 'vuex';
import './profile_menu';
import '../search_input/search_input';

export default Vue.component('navbar', {
  template: require('./navbar.html'),
  data() {
    return {
      path: window.location.pathname
    };
  },
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
      $('#phoneSidenav').sidebar('toggle');
    });
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
  computed: mapState(['isAuthenticated'])
});
