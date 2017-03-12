export default {
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
};
