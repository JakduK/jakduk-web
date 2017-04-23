<template>
  <div class="ui info message">{{$t('common.msg.test.version')}}</div>
</template>

<script>
  export default {
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('jakdu.schedule'), _this.$t('jakdu'), _this.$t('common.jakduk'));
      });
    },
    created() {
      this.$store.commit('load', false);
    }
  }
</script>
