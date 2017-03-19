<template>
  <div>
    <div class="ui container sticky">
      <div class="ui fluid container">
        <div class="ui vertical blue inverted fluid menu">
          <router-link active-class="active" to="/home" class="item computer only row">{{$t('common.home')}}</router-link>
          <router-link active-class="active" to="/board/free" class="item computer only row">{{$t('board')}}</router-link>
          <a active-class="active" href="/gallery" class="item computer only row">{{$t('gallery')}}</a>
          <a active-class="active" href="/stats" class="item computer only row">{{$t('stats')}}</a>
          <a active-class="active" href="/jakdu" class="item computer only row">{{$t('jakdu.write')}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import $ from 'jquery';

  export default {
    mounted: () => {
      $('.ui.sticky').sticky({
        offset: 70
      });
    },
    computed: mapState(['sidenav'])
  };

</script>
