import {mapState} from 'vuex';
import $ from 'jquery';

export default {
  mounted: () => {
    $('.ui.sticky').sticky({
      offset: 70
    });
  },
  computed: mapState(['sidenav'])
};
