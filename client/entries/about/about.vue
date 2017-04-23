<template>
  <div>
    <h1 class="ui header dividing">{{$t('about.site')}}</h1>
    <h3>{{$t('common.jakduk')}}</h3>
    <p v-html="$t('about.jakdu')"></p>
    <h3>{{$t('common.jakduk.description')}}</h3>
    <p v-html="$t('about.jakduk')"></p>
    <h3>{{$t('common.msg.project.jakduk')}}</h3>
    <p v-html="$t('about.contribution')"></p>
    <p><a href="https://github.com/JakduK" target="_blank">https://github.com/JakduK</a></p>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('about.site'), _this.$t('common.jakduk'));
      });
    },
    created() {
      this.$store.commit('load', false);
    },
    mounted() {
      $('.ui.sticky').sticky('refresh', true);
    }
  }
</script>
