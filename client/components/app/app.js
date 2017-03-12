import {mapState} from 'vuex';
import Sidenav from '../sidenav/sidenav.vue';
import SiteFooter from '../site_footer/site_footer.vue';

export default {
  data() {
    return {
      appLoaded: false
    };
  },
  computed: mapState({
    loading(state) {
      if (!this.appLoaded && !state.loading) {
        this.appLoaded = true;
      }
      return state.loading;
    }
  }),
  components: {
    sidenav: Sidenav,
    'site-footer': SiteFooter
  }
};
