<template>
  <div :class="{'is-loading': loading}" id="main" class="pusher">
    <div v-if="globalMessage.length" class="global-message">
      <transition-group name="fade">
        <toast v-for="message in globalMessage" :key="message" :level="message.level" :title="message.title" :message="message.message" @on-click="toastClicked(message)"></toast>
      </transition-group>
    </div>

    <div :class="{'is-loading': loading}" class="ui container">
      <div class="ui grid">
        <div id="content" :class="{'is-loading': loading}" class="sixteen wide mobile sixteen wide tablet fourteen wide computer column">
          <router-view></router-view>
          <div v-show="loading" class="full-fill-loader">
            <div class="ui active large indeterminate text loader">{{$t('common.loading')}}</div>
          </div>
        </div>

        <!-- desktop sidenav -->
        <sidenav class="two wide computer only column"></sidenav>
      </div>
    </div>

    <!-- footer -->
    <site-footer class="ui container"></site-footer>

    <div v-show="loading" class="ui grid">
      <div :class="{'computer only': !appLoaded}" class="mobile only tablet only column full-fill-loader">
        <div class="ui active large indeterminate text loader">{{$t('common.loading')}}</div>
      </div>
    </div>
  </div>
</template>

<style src="../../../client/semantic/dist/semantic.css"></style>
<style>
  button {
    border: none;
    background: none;
    padding: 0;
  }

  #main {
    display: flex;
    flex-direction: column;
    padding-top: 70px;
  }

  #main.is-loading {
    overflow: hidden;
    height: 100%;
  }

  #main.is-loading > .ui.container.is-loading {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #content.is-loading {
    min-height: 500px;
  }

  * > .icon.large + * {
    vertical-align: middle;
  }

  .global-message {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
  }

  .full-fill-loader {
    z-index: 801;
    position: absolute !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100% !important;
    width: 100% !important;
    background-color: white;
  }

  .summary-list .thumbnail {
    width: 120px;
  }

  .board .extra,
  .widget .extra,
  .summary-list .extra {
    margin-top: 0.3em;
    font-size: 90%;
  }

  .nomargin {
    margin: 0 !important;
  }

  .nomargin-right {
    margin-right: 0 !important;
  }

  .nowrap {
    white-space: nowrap !important;
  }

  .text-overflow {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .pull-left {
    float: left !important;
  }

  .pull-right {
    float: right !important;
  }

  .clearfix:after {
    display: block;
    content: ' ';
    height: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden;
  }

  .text-center {
    text-align: center !important;
  }

  .text-right {
    text-align: right !important;
  }

  .inline {
    display: inline-block !important;
  }

  .cursor-pointer {
    cursor: pointer !important;
  }

  .vertical-align-middle {
    vertical-align: middle !important;
  }

  .vertical-align-top {
    vertical-align: top !important;
  }

  .break-all {
    word-break: break-all !important;
  }

  a.black-link {
    color: rgba(0, 0, 0, 0.87) !important;
  }

  .color-orange {
    color: #00aceb;
    font-weight: bold;
  }

  .ui.label.search-keyword {
    margin: 0.1em;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>

<script>
  import {mapState} from 'vuex';
  import Sidenav from '../sidenav/sidenav.vue';
  import SiteFooter from '../site_footer/site_footer.vue';

  export default {
    data() {
      return {
        appLoaded: false
      };
    },
    computed: {
      loading() {
        if (!this.appLoaded && !this.$store.state.loading) {
          this.appLoaded = true;
        }
        return this.$store.state.loading;
      },
      ...mapState({globalMessage: 'globalMessage'})
    },
    methods: {
      toastClicked(message) {
        this.$store.commit('deleteGlobalMessage', message);
      }
    },
    components: {
      sidenav: Sidenav,
      'site-footer': SiteFooter
    }
  };

</script>
