<template>
  <div>
    <button :class="{disabled: isFirst}" @click="prev" class="ui icon basic button">
      <i class="left chevron icon"></i>
    </button>
    <button :class="{disabled: isLast}" @click="next" class="ui right icon basic button">
      <i class="right chevron icon"></i>
    </button>
  </div>
</template>

<script>
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

</script>
