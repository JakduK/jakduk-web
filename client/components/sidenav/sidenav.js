import Vue from 'vue';
import {mapState} from 'vuex';
import $ from 'jquery';

export default Vue.component('sidenav', {
  template: require('./sidenav.html'),
  mounted: () => {
    $('.ui.sticky').sticky({
      offset: 70
    });
  },
  computed: mapState(['sidenav'])
});
