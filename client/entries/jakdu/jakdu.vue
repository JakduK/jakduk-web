<template>
  <div class="ui info message">{{$t('common.msg.test.version')}}</div>
</template>

<script>
  export default {
    created() {
      this.$store.commit('load', false);
    }
  }
</script>
