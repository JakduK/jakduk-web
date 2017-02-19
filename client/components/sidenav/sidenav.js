import Vue from 'vue';

Vue.component('sidenav', {
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