<template>
  <div :style="loading ? {overflow: 'hidden', height: '100%'} : {}" :class="{'is-loading': loading}" id="main" class="pusher">
    <div class="ui container">
      <div class="ui grid">
        <div id="content" class="sixteen wide mobile sixteen wide tablet thirteen wide computer column">
          <router-view></router-view>
          <div v-if="loading" class="full-fill-loader">
            <div class="ui active large indeterminate text loader">{{$t('common.loading')}}</div>
          </div>
        </div>

        <!-- desktop sidenav -->
        <sidenav class="three wide computer only column"></sidenav>
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

  .inline {
    display: inline-block;
  }
</style>

<script src="./app.js"></script>
