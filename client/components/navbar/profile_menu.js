import Vue from 'vue';
import {mapState} from 'vuex';

export default Vue.component('profile-menu', {
  template: require('./profile_menu.html'),
  computed: mapState(['profile', 'notification'])
});
