<template>
  <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: item.seq}, query: $route.query}" class="item">
    <div class="left floated content">
      <div :class="{'ui tiny disabled': item.status && item.status.delete}" class="header">
        <span v-if="isNotice" class="ui horizontal basic label nowrap">
          <i class="announcement blue icon"></i>{{$t('board.notice')}}
        </span>
        {{(item.status && item.status.delete) ? $t('board.msg.deleted') : item.subject}}
        <span v-if="!item.status || !item.status.delete" :class="categoryColor(item.category)" class="ui tiny basic label">
          {{$t(categoryLabel(item.category))}}
        </span>
      </div>
      <div class="extra">
        {{item.seq}} &middot;
        <template v-if="item.writer">
          <strong>{{item.writer.username}}</strong> &middot;
        </template>
        <span class="nowrap">{{item.id | IdToRegDate('LL')}} &middot;</span>
        <span class="nowrap"><i class="talk outline icon"></i>{{item.commentCount}}</span>
      </div>
    </div>
    <div class="right floated content text-right">
      <template v-if="item.galleries && item.galleries.length" >
        <div class="ui rounded bordered image thumbnail">
          <img :src="item.galleries[0].thumbnailUrl">
        </div>
      </template>
      <span class="extra nowrap">
        <i class="eye icon"></i>{{item.views}} &middot;
        <i class="smile blue icon"></i>{{item.likingCount}} &middot;
        <i class="frown pink icon"></i>{{item.dislikingCount}}
      </span>
    </div>
  </router-link>
</template>

<script>
  import IdToRegDate from '../../filters/id_to_regdate';
  import CategoryColor from '../../filters/category_color';
  import CategoryIcon from '../../filters/category_icon';
  import CategoryLabel from '../../filters/category_label';

  export default {
    props: ['item', 'isNotice'],
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      categoryIcon: CategoryIcon,
    }
  }
</script>
