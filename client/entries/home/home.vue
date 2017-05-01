<template>
  <div class="ui tablet reversed computer reversed grid">
    <div class="sixteen wide mobile ten wide tablet twelve wide computer column">
      <!-- 공지 -->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue announcement icon"></i> {{$t('common.news')}}</h5>
        <div class="ui blue segment">
          <div v-if="latest" class="ui divided items">
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
            <div class="ui divided items">
              <router-link :to="{name: 'board.view', params: {name: 'free', seq: post.seq}}" v-for="post in latest.posts" :key="post.seq" class="item">
                <div class="content">
                  <div :class="{'ui tiny disabled': post.status.delete}"  class="header">
                    <div v-if="!isEmptyArray(post.galleries)" class="right floated content">
                      <div class="ui rounded bordered image thumbnail">
                        <img :src="post.galleries[0].thumbnailUrl">
                      </div>
                    </div>
                    <div class="break-all">
                      {{post.status.delete ? $t('board.msg.deleted') : post.subject}}
                    </div>
                  </div>
                  <div v-if="post.writer" class="extra">
                    <p>{{post.shortContent}}...</p>
                    <p>
                      <span class="ui avatar bordered image">
                        <img :src="avatarSrc(post.writer.picture)">
                      </span>
                      <strong>{{post.writer.username}}</strong><span class="nowrap"> &middot; {{post.id | IdToRegDate('LL')}}</span>
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 최신 댓글 -->
        <div class="ui segments summary-list">
          <h5 class="ui segment"><i class="blue talk icon"></i> {{$t('home.comments.latest')}}</h5>
          <div class="ui blue segment">
            <div class="ui divided items">
              <router-link :to="{name: 'board.view', params: {name: 'free', seq: comment.boardItem.seq}}" v-for="comment in latest.comments" :key="comment.id" class="item">
                <div class="content">
                  <div class="header break-all">{{comment.content}}</div>
                  <div v-if="comment.writer" class="extra">
                    <span class="ui avatar bordered image">
                      <img :src="avatarSrc(comment.writer.picture)">
                    </span>
                    <strong>{{comment.writer.username}}</strong> &middot {{comment.id | IdToRegDate('LL')}}
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
          <router-link to="/gallery" class="black-link">
            <i class="blue image icon"></i> {{$t('home.pictures.latest')}} <i class="chevron right blue icon pull-right"></i>
          </router-link>
        </h5>
        <div class="ui blue segment">
          <div v-if="latest" class="swiper-container text-overflow">
            <div class="swiper-wrapper">
              <div v-for="image in latest.galleries" :key="image.id" data-swiper-autoplay="3000" class="swiper-slide pull-left">
                <router-link :to="{name: 'gallery.view', params: {id: image.id}}" class="ui fluid rounded bordered image">
                  <img :data-src="image.thumbnailUrl" class="swiper-lazy">
                  <div class="ui divider"></div>
                  <div v-if="image.writer" class="">{{image.writer.username}}
                    <span class="nowrap">&middot; <i class="eye icon"></i>{{image.views}}</span>
                  </div>
                </router-link>
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
          <router-link :to="{name: 'search', query: {q: word.key, w: 'PO;CO;GA', from: 0, size: 3}}" v-for="(word, index) in popularSearchWords" :key="word" :class="indexedColor(index, true)" class="ui label search-keyword">
            {{word.key}}
          </router-link>
        </div>
        <div v-else class="ui blue segment">{{$t('failed.loading')}}</div>
      </div>

      <!--최근 가입 회원-->
      <div class="ui segments">
        <h5 class="ui segment"><i class="blue birthday icon"></i> {{$t('home.members.registered.latest')}}</h5>
        <div class="ui blue segment">
          <div v-if="latest" class="ui middle aligned relaxed list">
            <div v-for="(user, index) in latest.users" :key="user.id" class="item">
              <div class="image" :style="{width: user.about ? '50px' : ''}">
                <img :src="avatarSrc(user.picture)" class="ui image avatar nomargin">
                <i v-if="user.about" class="talk small outline fitted icon vertical-align-top"></i>
              </div>
              <div class="content">
                <div class="header">{{user.username}}</div>
                <div v-if="user.about" class="description extra">{{user.about}}</div>
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

<style scoped>
  .ui.items .item .header {
    display: block;
  }
</style>

<script>
  import $ from 'jquery';
  import Swiper from 'swiper';
  import Truncate from 'lodash/fp/truncate';
  import IdToRegDate from '../../filters/id_to_regdate';
  import IndexedColor from '../../filters/indexed_color';

  function reduce() {
    return Array.prototype.reduce.call(arguments[0], arguments[1], arguments[2]);
  }

  function fetch() {
    const promises = $.when(
      $.getJSON('/api/home/latest').then(data => data, (response, result) => result),
      $.getJSON('/api/search/popular/words?size=10').then(data => data, (response, result) => result),
      $.getJSON('/api/home/encyclopedia').then(data => data, (response, result) => result)
    );

    promises.always((latest, popularSearchWords, encyclopedia) => {
      if (latest !== 'error') {
        let $news = $(`<div>${latest.homeDescription.desc}</div>`).find('>ul').children();
        latest.homeDescription.desc = reduce($news, (list, elem) => {
          list.push(elem.innerHTML);
          return list;
        }, []);
      }

      this.latest = latest === 'error' ? undefined : latest;
      this.popularSearchWords = popularSearchWords === 'error' ? undefined : popularSearchWords.popularSearchWords;
      this.encyclopedia = encyclopedia === 'error' ? undefined : encyclopedia;
      this.$store.commit('load', false);

      this.$nextTick(() => {
        $('.swiper-container').each((index, element) => {
          /* eslint-disable no-new */
          new Swiper(element, {
            autoplay: true,
            autoplayDisableOnInteraction: false,
            loop: true,
            setWrapperSize: true,
            preloadImages: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true
          });
        });
      });
    });
  }

  export default {
    data() {
      return {
        latest: {
          posts: [],
          comments: [],
          galleries: [],
          users: [],
          homeDescription: {}
        },
        popularSearchWords: [],
        encyclopedia: {},
        isReady: false
      };
    },
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('common.jakduk'));
        fetch.call(_this);
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
    },
    computed: {
      encyclopediaSummary() {
        return `${Truncate({length: 100})(this.encyclopedia.content)}`;
      }
    },
    methods: {
      indexedColor: IndexedColor
    },
    filters: {
      IdToRegDate: IdToRegDate
    }
  };
</script>
