import Vue from 'vue';
import {mapState} from 'vuex';
import './app.css';
import '../search_input/search_input';
import '../site_footer/site_footer';

export default Vue.component('app', {
  data() {
    return {
      appLoaded: false
    };
  },
  template: require('./app.html'),
  computed: mapState({
    loading(state) {
      if (!this.appLoaded && !state.loading) {
        this.appLoaded = true;
      }
      return state.loading;
    }
  })
});
