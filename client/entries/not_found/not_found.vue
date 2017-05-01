<template>
  <div class="main">
    <div>
      <img src="https://jakduk.com/assets/jakduk/img/logo_256.png" alt="Logo" class="logo">
      <h1 class="status">{{err.status || '404'}}</h1>
      <h2 class="status_message">{{err.message || $t('common.msg.error.404')}}</h2>
      <h1 class="jakduk">{{$t('common.jakduk')}}</h1>
      <code v-if="err" class="ui segment error-block">Status: {{err.status}},
        Message: {{err.message}},
        Stack:
        {{err.stack}}
      </code>
    </div>
  </div>
</template>

<style scoped>
  .main {
    font-family: sans-serif;
    line-height: 1.15;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    font-size: 14px;
    display: table;
    height: 100%;
    width: 100%;
  }

  .main > div {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

  .status {
    color: #656D78;
    font-size: 8em;
    margin: 40px 0 0 0;
    line-height: 140px;
  }

  .status_message {
    color: #434a54;
    font-size: 2em;
    margin:0;
  }

  .jakduk {
    color: #AAB2BD;
    font-size: 1.4em;
  }

  .logo {
    width: 200px;
  }

  .error-block {
    display: table;
    table-layout: fixed;
    width: 100%;
    text-align: left;
    white-space: pre-line;
    font-size: 0.9em;
  }

  @media (min-width: 720px) {
    .main {
      font-size: 18px;
    }

    .logo {
      width: auto;
    }
  }
</style>

<script>
  import {mapState} from 'vuex';

  export default {
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('common.error'), _this.$t('common.jakduk'));
      });
    },
    created() {
      this.$store.commit('load', false);
    },
    computed: mapState(['err'])
  }
</script>
