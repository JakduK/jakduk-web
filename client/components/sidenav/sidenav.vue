<template>
  <div>
    <div class="ui container sticky">
      <div class="ui fluid container">
        <div class="ui vertical blue inverted fluid menu">
          <router-link active-class="active" to="/home" class="item computer only row">
            {{$t('common.home')}}
          </router-link>
          <router-link active-class="active" to="/board/free" class="item computer only row">
            {{$t('board.name.free')}}
          </router-link>
          <router-link active-class="active" to="/board/football" class="item computer only row">
            {{$t('board.name.football')}}
          </router-link>
          <router-link active-class="active" to="/board/developer" class="item computer only row">
            {{$t('board.name.swdev')}}
          </router-link>
          <router-link active-class="active" to="/gallery" class="item computer only row">
            {{$t('gallery')}}
          </router-link>
          <router-link :class="{active: $route.name && $route.name.startsWith('stats')}" to="/stats/supporters" class="item computer only row">
            {{$t('stats')}}
          </router-link>
          <router-link active-class="active" to="/jakdu" class="item computer only row">
            {{$t('jakdu.write')}}
          </router-link>
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
