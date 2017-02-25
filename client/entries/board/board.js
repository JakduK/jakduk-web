import Vue from 'vue';

export default Vue.component('board', {
  template: require('./board.html'),
  mounted() {
    this.$store.commit('loaded');
    $('.ui.sticky').sticky('refresh', true);
  }
});
