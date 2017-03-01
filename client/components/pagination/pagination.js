import Vue from 'vue';

export default Vue.component('pagination', {
  props: {
    pagination: Object
  },
  template: require('./pagination.html'),
  methods: {
    next() {
      this.$emit('change', this.pagination.current + 1);
    },
    prev() {
      this.$emit('change', this.pagination.current - 1);
    },
    change(index) {
      this.$emit('change', index);
    },
    shift() {

    },
    unshift() {

    }
  }
});
