import Vue from 'vue';
import {mapState} from 'vuex';

export default Vue.component('board', {
  template: require('./board.html'),
  created() {
    this.$store.commit('load', true);
  },
  beforeRouteEnter(to, from, next) {
    next(_this => {
      _this.$store.commit('load', false);
      _this.$nextTick(() => {
        $('.ui.sticky').sticky('refresh', true);
      });
    });
  },
  computed: {
    ...mapState({
      loading: 'loading'
    })
  }
});
