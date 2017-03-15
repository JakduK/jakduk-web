export default {
  props: {
    pagination: Object
  },
  methods: {
    change(number) {
      this.$emit('on-change', number);
    }
  }
};
