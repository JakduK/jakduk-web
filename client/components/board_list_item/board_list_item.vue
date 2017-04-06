<template>
  <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: item.seq}, query: $route.query}" class="item">
    <div class="content">
      <div :class="{'ui tiny disabled': item.status && item.status.delete}" class="header break-all">
        <div v-if="!isEmptyArray(item.galleries)" class="pull-right">
          <div class="ui rounded bordered image thumbnail">
            <img :src="item.galleries[0].thumbnailUrl">
          </div>
        </div>
        <div class="ui mini labels">
          <div :class="categoryColor(item.category)" class="ui label nomargin-right">
            {{$t(categoryLabel(item.category))}}<div class="detail">{{item.seq}}</div>
          </div>
          <div v-if="isNotice" class="ui basic label nowrap">
            <i class="announcement blue icon"></i>{{$t('board.notice')}}
          </div>
        </div>
        <div class="header">{{(item.status && item.status.delete) ? $t('board.msg.deleted') : item.subject}}</div>
      </div>

      <div class="extra">{{item.shortContent}}...</div>

      <div class="extra">
        <div class="nomargin">
          <div class="ui small labels">
            <div v-if="item.writer" :class="{image: item.writer.picture}" class="ui image basic label nomargin">
              <img :src="avatarSrc(item.writer.picture)">
              {{item.writer.username}}
            <div class="detail">{{item.id | IdToRegDate('LL')}}</div>
            </div>
            <div class="ui basic label nomargin"><i class="talk outline icon"></i>{{item.commentCount}}</div>
            <div class="ui small labels pull-right">
              <div class="ui basic label nomargin"><i class="eye icon"></i>{{item.views}}</div>
              <div class="ui basic label nomargin"><i class="smile blue icon"></i>{{item.likingCount}}</div>
              <div class="ui basic label nomargin"><i class="meh teal icon"></i>{{item.dislikingCount}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
  .ui.items .item .thumbnail {
    display: block;
    width: 120px;
  }

  .ui.items .item .header {
    display: block;
  }
</style>

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
