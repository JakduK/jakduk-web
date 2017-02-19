import Vue from 'vue';
import {mapState} from 'vuex';

Vue.component('profile-menu', {
  template: require('./profile_menu.html'),
  computed: mapState(['profile', 'notification'])
});