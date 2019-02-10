<template>
  <div>
    <div class="ui header text-center">{{$t('stats.about')}}</div>
    <div class="ui divider"></div>

    <div class="ui two item menu">
      <router-link to="/stats/attendance" active-class="active" class="item">{{$t('stats.attendance')}}</router-link>
      <router-link to="/stats/supporters" active-class="active" class="item">{{$t('stats.supporters')}}</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>
