import Vue from 'vue';

export default Vue.component('sidenav', {
  template: require('./sidenav.html'),
  props: {
    popularSearchWords: Array,
    newUsers: Array,
    encyclopedia: Object
  },
  mounted: () => {
    $('.ui.sticky').sticky({
      offset: 70
    });
  }
});
