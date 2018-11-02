<template>
  <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: item.seq}, query: $route.query}" class="item">
    <div class="content">
      <div :class="{'ui tiny disabled': item.status && item.status.delete}" class="header break-all">
        <div v-if="!isNotice && !isEmptyArray(item.galleries)" class="pull-right">
          <div class="ui rounded bordered image thumbnail">
            <img :src="item.galleries[0].thumbnailUrl">
          </div>
        </div>
        <div v-if="isNotice" class="ui horizontal basic label">
          <i class="announcement blue icon"></i>{{$t('board.notice')}}
        </div>
        <span class="vertical-align-middle">
          {{(item.status && item.status.delete) ? $t('board.msg.deleted') : item.subject}}
        </span>
      </div>

      <div v-if="!isNotice" class="extra">{{truncate(item.shortContent)}}</div>

      <div class="extra">
        <div class="ui small labels nomargin">
          <div v-if="!isNotice" :class="category ? category.color : 'grey'" class="ui label bottom">
            {{category ? category.name : item.seq}}<div v-if="category" class="detail">{{item.seq}}</div>
          </div>
          <div v-if="item.writer" :class="{image: item.writer.picture}" class="ui image basic label bottom">
            <img :src="avatarSrc(item.writer.picture)">
            {{item.writer.username}}
            <div class="detail">{{item.id | IdToRegDate('LL')}}</div>
          </div>
          <span class="pull-right counter">
            <i class="talk outline icon"></i>{{item.commentCount}} &middot;
            <i class="eye icon"></i>{{item.views}} &middot;
            <i class="smile blue icon"></i>{{item.likingCount}} &middot;
            <i class="meh red icon"></i>{{item.dislikingCount}}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
  .ui.items .item .thumbnail {
    display: block;
    width: 120px;
    margin-top: 6px;
    margin-left: 6px;
  }

  .ui.items .item .header {
    display: block;
  }

  .ui.label.bottom {
    margin: 5px 0 0 0;
  }

  .counter {
    margin-top: 6px;
  }
</style>

<script>
  import IdToRegDate from '../../filters/id_to_regdate';
  import Truncate from 'lodash/fp/truncate';

  export default {
    props: ['category', 'item', 'isNotice'],
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      truncate: Truncate({length: 99})
    }
  }
</script>
