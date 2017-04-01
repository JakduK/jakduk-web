<template>
  <div :style="loading ? {overflow: 'hidden', height: '100%'} : {}" :class="{'is-loading': loading}" id="main" class="pusher">
    <div v-if="globalMessage.length" class="global-message">
      <transition-group name="fade">
        <toast v-for="message in globalMessage" :key="message" :level="message.level" :title="message.title" :message="message.message" @on-click="toastClicked(message)"></toast>
      </transition-group>
    </div>

    <div :style="loading ? {overflow: 'hidden', display: 'flex', 'flex-direction': 'column'} : {}" class="ui container">
      <div class="ui grid">
        <div id="content" class="sixteen wide mobile sixteen wide tablet fourteen wide computer column">
          <router-view></router-view>
          <div v-if="loading" class="full-fill-loader">
            <div class="ui active large indeterminate text loader">{{$t('common.loading')}}</div>
          </div>
        </div>

        <!-- desktop sidenav -->
        <sidenav class="two wide computer only column"></sidenav>
      </div>
    </div>

    <!-- footer -->
    <site-footer class="ui container"></site-footer>

    <div v-if="!appLoaded && loading" class="full-fill-loader">
      <div class="ui active large indeterminate text loader">{{$t('common.loading')}}</div>
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

  #content .is-loading {
    min-height: 500px;
  }

  #content .is-loading  .full-fill-loader > .ui.loader {
    top: 240px;
  }

  .global-message {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
  }

  * > .icon.large + * {
    vertical-align: middle;
  }

  .full-fill-loader {
    z-index: 801;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
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

  .nowrap {
    white-space: nowrap;
  }

  .text-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pull-left {
    float: left;
  }

  .pull-right {
    float: right;
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
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .inline {
    display: inline-block;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .vertical-align-middle {
    vertical-align: middle;
  }

  .break-all {
    word-break: break-all;
  }

  a.black-link {
    color: rgba(0, 0, 0, 0.87);
  }

  .color-orange {
    color: #00aceb;
    font-weight: bold;
  }

  .ui.label.search-keyword {
    margin: 0.1em;
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
