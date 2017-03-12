<template>
  <div class="ui tablet reversed computer reversed grid">
    <div class="sixteen wide mobile eleven wide tablet twelve wide computer column">
      <!--top네이게이션-->
      <div class="ui grid">
        <pagination :pagination="pagination" @change="onPageChange" class="sixteen wide mobile twelve wide tablet twelve wide computer column"></pagination>
        <pager :is-first="pagination.first" :is-last="pagination.last" @on-prev="onPageChange" @on-next="onPageChange" class="four wide tablet only four wide computer only right aligned column"></pager>
      </div>

      <div v-if="board" class="ui segments">
        <!--분류-->
        <div class="ui segment">
          <select id="categories" class="ui dropdown">
            <option v-for="id in categories" :value="id">
              <i :class="[categoryColor(id), categoryIcon(id)]" class="icon"></i> {{$t(categoryLabel(id))}}
            </option>
          </select>
          <button v-tooltip :data-content="$t('board.write')" @click="compose" class="ui right floated icon button"><i class="write icon"></i></button>
        </div>

        <div class="ui blue segment">
          <!--공지-->
          <div class="ui selection relaxed small list notice">
            <router-link :to="{path: '/board/topic/' + notice.seq, query: $route.query}" v-for="notice in board.notices" :key="notice.seq" class="item">
              <div class="ui image">
                <span class="ui basic small label nowrap"><i class="announcement blue icon"></i>{{$t('board.notice')}}</span>
              </div>
              <div class="middle aligned content">
                <div class="header">{{(notice.status && notice.status.delete) ? $t('board.msg.deleted') : notice.subject}}</div>
              </div>
            </router-link>
          </div>

          <!-- 게시글 -->
          <div class="ui selection divided list board">
            <router-link :to="{path: '/board/topic/' + post.seq, query: $route.query}" v-for="post in board.posts" :key="post.seq" class="item">
              <div class="right floated content">
                <div v-if="post.galleries && post.galleries.length" class="ui rounded bordered image thumbnail">
                  <img :src="post.galleries[0].thumbnailUrl">
                </div>
              </div>
              <div class="content">
                <div :class="{'ui tiny disabled': post.status && post.status.delete}" class="header">
                  {{(post.status && post.status.delete) ? $t('board.msg.deleted') : post.subject}}
                  <span v-if="!post.status || !post.status.delete" :class="categoryColor(post.category)" class="ui tiny basic label">
                  {{$t(categoryLabel(post.category))}}
                </span>
                </div>
                <div class="extra">
                  {{post.seq}} &middot;
                  <template v-if="post.writer"><strong>{{post.writer.username}}</strong> &middot;</template>
                  <span class="nowrap">{{post.id | IdToRegDate('LL')}} &middot;</span>
                  <span class="nowrap"><i class="talk outline flipped horizontally icon"></i>{{post.commentCount}}</span>
                  <span class="pull-right nowrap">
                  <i class="eye icon"></i>{{post.views}} &middot;
                    <i class="smile blue icon"></i>{{post.likingCount}} &middot;
                    <i class="frown pink icon"></i>{{post.dislikingCount}}
                </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else class="ui segment">{{$t('failed.loading')}}</div>

      <!--bottom네비게이션-->
      <div class="ui grid">
        <pagination :pagination="pagination" @change="onPageChange" class="eleven wide tablet computer only column"></pagination>
        <pager :is-first="pagination.first" :is-last="pagination.last" @on-prev="onPageChange" @on-next="onPageChange" class="sixteen wide mobile five wide tablet five wide computer right aligned column"></pager>
      </div>
    </div>

    <div class="sixteen wide mobile five wide tablet four wide computer column">
      <!--주간 좋아요 선두-->
      <div class="ui segments widget">
        <h5 class="ui segment"><i class="thumbs outline up teal icon"></i> {{$t('board.top.likes')}}</h5>
        <div class="ui blue segment">
          <div v-if="top" class="ui middle aligned selection relaxed small list">
            <router-link :to="{path: '/board/topic/' + post.seq, query: $route.query}" v-for="(post, index) in top.topLikes" :key="post.seq" v-tooltip :data-content="post.subject" class="item">
              <div class="header text-overflow">{{post.subject}}</div>
              <div class="extra">
                <i class="smile icon"></i>{{post.count}} &middot; <i class="eye icon"></i>{{post.views}}
              </div>
            </router-link>
            <p v-if="!top.topLikes.length">
              <i class="warning red icon"></i>{{$t('there.is.no.activity')}}
            </p>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>

      <!--주간 댓글 선두-->
      <div class="ui segments widget">
        <h5 class="ui segment"><i class="talk flipped horizontally green icon"></i> {{$t('board.top.comments')}}</h5>
        <div class="ui blue segment">
          <div v-if="top" class="ui middle aligned selection relaxed small list">
            <router-link :to="{path: '/board/topic/' + post.seq, query: $route.query}" v-for="(post, index) in top.topComments" :key="post.seq" v-tooltip :data-content="post.subject" class="item">
              <div class="header text-overflow">{{post.subject}}</div>
              <div class="extra">
                <i class="talk outline flipped horizontally icon"></i>{{post.count}} &middot; <i class="eye icon"></i>{{post.views}}
              </div>
            </router-link>
            <p v-if="!top.topComments.length">
              <i class="warning red icon"></i>{{$t('there.is.no.activity')}}
            </p>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .board .ui.label {
    padding: 0.2em 0.4em;
  }

  .board .thumbnail {
    width: 54px;
  }

  .ui.list.notice {
    margin-bottom: 0.5em;
  }

  .ui.list.notice + .ui.list {
    margin-top: 0;
  }

  .ui.list.notice .item {
    padding-top: 0.3em !important;
    padding-bottom: 0.3em !important;
  }
</style>

<script src="./board.js"></script>
