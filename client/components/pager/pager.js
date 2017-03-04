import Vue from 'vue';

export default Vue.component('pager', {
  template: require('./pager.html'),
  props: {
    isFirst: Boolean,
    isLast: Boolean
  },
  methods: {
    next() {
      this.$emit('on-next', 'next');
    },
    prev() {
      this.$emit('on-prev', 'prev');
    }
  }
});
