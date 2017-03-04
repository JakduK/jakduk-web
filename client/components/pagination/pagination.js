import Vue from 'vue';

export default Vue.component('pagination', {
  props: {
    pagination: Object
  },
  template: require('./pagination.html'),
  methods: {
    next() {
      this.$emit('change', 'next');
    },
    prev() {
      this.$emit('change', 'prev');
    },
    change(number) {
      this.$emit('change', number);
    },
    shift() {
      this.$emit('change', 'shift');
    },
    unshift() {
      this.$emit('change', 'unshift');
    }
  }
});
