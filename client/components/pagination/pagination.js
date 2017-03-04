import Vue from 'vue';

export default Vue.component('pagination', {
  template: require('./pagination.html'),
  props: {
    pagination: Object
  },
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
