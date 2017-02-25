import Vue from 'vue';
import {mapState} from 'vuex';
import './app.css';
import '../search_input/search_input';

export default Vue.component('app', {
  template: require('./app.html'),
  computed: mapState(['loading'])
});
