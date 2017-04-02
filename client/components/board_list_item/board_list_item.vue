<template>
  <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: item.seq}, query: $route.query}" class="item">
    <div class="content">
      <div :class="{'ui tiny disabled': item.status && item.status.delete}" class="header break-all">
        <div v-if="!isEmptyArray(item.galleries)" class="pull-right">
          <div class="ui rounded bordered image thumbnail">
            <img :src="item.galleries[0].thumbnailUrl">
          </div>
        </div>
        <span v-if="isNotice" class="ui horizontal small basic label nowrap">
          <i class="announcement blue icon"></i>{{$t('board.notice')}}
        </span>
        <span class="vertical-align-middle">
          {{(item.status && item.status.delete) ? $t('board.msg.deleted') : item.subject}}
        </span>
      </div>

      <div class="extra">{{item.shortContent}}...</div>

      <div class="extra">
        <div class="pull-left nomargin">
          <div :class="categoryColor(item.category)" class="ui label">
            {{$t(categoryLabel(item.category))}}
            <div class="detail">{{item.seq}}</div>
          </div>
          <div v-if="item.writer" :class="{image: item.writer.picture}" class="ui basic label">
            <img v-if="item.writer.picture" :src="item.writer.picture">
            <i v-else class="icon spy"></i>
            {{item.writer.username}}
            <div class="detail">{{item.id | IdToRegDate('LL')}}</div>
          </div>
        </div>
        <div class="nowrap pull-right">
          <i class="eye icon"></i>{{item.views}} &middot;
          <i class="smile blue icon"></i>{{item.likingCount}} &middot;
          <i class="meh teal icon"></i>{{item.dislikingCount}}
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

  .ui.items .item .ui.label {
    padding: 0.4em 0.6em;
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
