import Vue from 'vue';
import Vuex from 'vuex';
import '../search_input/search_input';

export default Vue.component('app', {
  template: require('./app.html'),
  computed: Vuex.mapState(['loading'])
});
