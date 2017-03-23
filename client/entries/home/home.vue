<template>
  <div class="ui tablet reversed computer reversed grid">
    <div class="sixteen wide mobile ten wide tablet twelve wide computer column">
      <!-- 공지 -->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue announcement icon"></i> {{$t('common.news')}}</h5>
        <div class="ui blue segment">
          <div v-if="latest" class="ui selection list">
            <div v-for="desc in latest.homeDescription.desc" v-html="desc" class="item"></div>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>

      <template v-if="latest">
        <!-- 최신글 -->
        <div class="ui segments summary-list">
          <h5 class="ui segment"><i class="blue feed icon"></i> {{$t('home.posts.latest')}}</h5>
          <div class="ui blue segment">
            <div class="ui selection divided list">
              <router-link :to="{name: 'board.view', params: {name: 'free', seq: post.seq}}" v-for="post in latest.posts" :key="post.seq" class="item">
                <div class="right floated content">
                  <div v-if="post.galleries && post.galleries.length" class="ui rounded bordered image thumbnail">
                    <img :src="post.galleries[0].thumbnailUrl">
                  </div>
                </div>
                <div class="content">
                  <div :class="{'ui tiny disabled': post.status.delete}"  class="header">
                    {{post.status.delete ? $t('board.msg.deleted') : post.subject}}
                  </div>
                  <template v-if="post.writer">
                    <div class="extra">{{post.shortContent}}</div>
                    <div class="extra">
                      <strong>{{post.writer.username}}</strong> &middot; {{post.id | IdToRegDate('LL')}}
                    </div>
                  </template>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 최신 댓글 -->
        <div class="ui segments summary-list">
          <h5 class="ui segment"><i class="blue talk icon"></i> {{$t('home.comments.latest')}}</h5>
          <div class="ui blue segment">
            <div class="ui selection divided list">
              <router-link :to="{name: 'board.view', params: {name: 'free', seq: comment.boardItem.seq}}" v-for="comment in latest.comments" :key="comment.id" class="item">
                <div class="content">
                  <div class="header">{{comment.content}}</div>
                  <div v-if="comment.writer" class="extra">
                    <strong>{{comment.writer.username}}</strong> &middot; {{comment.id | IdToRegDate('LL')}}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="sixteen wide mobile six wide tablet four wide computer column">
      <!-- 최신 사진 -->
      <div class="ui segments">
        <h5 class="ui segment">
          <a href="/gallery" class="black-link">
            <i class="blue image icon"></i> {{$t('home.pictures.latest')}} <i class="chevron right blue icon pull-right"></i>
          </a>
        </h5>
        <div class="ui blue segment">
          <div v-if="latest" class="swiper-container text-overflow">
            <div class="swiper-wrapper">
              <div v-for="image in latest.galleries" :key="image.id" data-swiper-autoplay="3000" class="swiper-slide pull-left">
                <a :href="'/gallery/' + image.id" class="ui fluid rounded bordered image">
                  <img :data-src="image.thumbnailUrl" class="swiper-lazy">
                  <div class="ui divider"></div>
                  <div v-if="image.writer" class="">{{image.writer.username}}
                    <span class="nowrap">&middot; <i class="eye icon"></i>{{image.views}}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>

      <!--인기 검색어-->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue search icon"></i> {{$t('popular.search.words')}}</h5>
        <div v-if="popularSearchWords" class="ui blue segment">
          <a :class="indexedColor(index, true)" :href="searchQuery(word.key)" v-for="(word, index) in popularSearchWords" :key="word.key" class="ui label search-keyword">{{word.key}}</a>
        </div>
        <div v-else class="ui blue segment">{{$t('failed.loading')}}</div>
      </div>

      <!--최근 가입 회원-->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue birthday icon"></i> {{$t('home.members.registered.latest')}}</h5>
        <div class="ui blue segment">
          <div v-if="latest" class="ui middle aligned small list">
            <div v-for="(user, index) in latest.users" :key="user.id" class="item">
              <i :class="indexedColor(index, false)" class="user big fitted icon"></i>
              <i v-if="user.about" :class="indexedColor(index, false)" class="talk small fitted icon"></i>
              <div class="content">
                <div class="header">{{user.username}}</div>
                <div class="description extra">{{user.about}}</div>
              </div>
            </div>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>

      <!--백과사전-->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue quote right icon"></i> {{$t('home.encyclopedia')}}</h5>
        <div class="ui blue segment">
          <div v-if="encyclopedia" v-tooltip :data-content="encyclopedia.content">
            <strong>{{encyclopedia.subject}}</strong>
            <p v-if="encyclopedia.content">{{encyclopediaSummary}}</p>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .ui.label.search-keyword {
    margin: 0.1em;
  }
</style>

<script src="./home.js"></script>
