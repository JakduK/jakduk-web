export default {
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
};
