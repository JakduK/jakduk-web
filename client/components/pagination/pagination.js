export default {
  props: {
    pagination: Object
  },
  methods: {
    unshift() {
      this.$emit('on-change', 'unshift');
    },
    shift() {
      this.$emit('on-change', 'shift');
    },
    change(number) {
      this.$emit('on-change', number);
    }
  }
};
