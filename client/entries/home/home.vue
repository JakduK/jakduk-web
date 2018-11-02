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
              <router-link :to="{name: 'board.view', params: {name: article.board.toLowerCase(), seq: article.seq}}" v-for="article in latest.articles" :key="article.seq" class="item">
                <div class="content">
                  <div :class="{'ui tiny disabled': article.status && article.status.delete}"  class="header">
                    <div v-if="!isEmptyArray(article.galleries)" class="right floated content">
                      <div class="ui rounded bordered image thumbnail">
                        <img :src="article.galleries[0].thumbnailUrl">
                      </div>
                    </div>
                    <div class="break-all">
                      <div :class="article.category ? categories[article.board][article.category].color : 'grey'" class="ui label bottom">
                        {{convertBoardName(article.board)}}<div v-if="article.category" class="detail">{{categories[article.board][article.category].name}}</div>
                      </div>
                      <span class="vertical-align-middle">{{article.status && article.status.delete ? $t('board.msg.deleted') : article.subject}}</span>
                    </div>
                  </div>
                  <div v-if="article.writer" class="extra">
                    <p>{{truncate(article.shortContent)}}</p>
                    <p>
                      <span class="ui avatar bordered image">
                        <img :src="avatarSrc(article.writer.picture)">
                      </span>
                      <strong>{{article.writer.username}}</strong><span class="nowrap"> &middot; {{article.id | IdToRegDate('LL')}}</span>
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
              <router-link :to="{name: 'board.view', params: {name: comment.article.board.toLowerCase(), seq: comment.article.seq}}" v-for="comment in latest.comments" :key="comment.id" class="item">
                <div class="content">
                  <div class="ui header small break-all">{{comment.content}}</div>
                  <div class="extra"><i class="caret right icon"></i>{{comment.article.subject}}</div>
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
                <router-link :to="{name: 'gallery.view', params: {id: image.id}}" class="ui rounded bordered image">
                  <img :data-src="image.thumbnailUrl" class="swiper-lazy">
                  <div class="ui divider"></div>
                  <div v-if="image.writer">
                    <img :src="avatarSrc(image.writer.picture)" class="ui image avatar nomargin">
                    &nbsp;{{image.writer.username}}
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
          <router-link :to="{name: 'search', query: {q: word.key, w: 'ARTICLE;COMMENT;GALLERY', from: 0, size: 3}}" v-for="(word, index) in popularSearchWords" :key="word.key" :class="indexedColor(index, true)" class="ui label search-keyword">
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
              <img :src="avatarSrc(user.picture)" class="ui image avatar nomargin">
              <div class="content">
                <div class="header">{{user.username}}</div>
                <div v-if="user.about" class="description extra">
                  <i class="talk small outline fitted icon vertical-align-top flipped horizontally"></i>
                  {{user.about}}
                </div>
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
  import BoardName from '../../filters/board_name';
  import createCategoriesVM from '../../filters/categories_view_model';

  function reduce() {
    return Array.prototype.reduce.call(arguments[0], arguments[1], arguments[2]);
  }

  function fetch() {
    const promises = $.when(
      $.getJSON('/api/home/latest').then(data => data, (response, result) => result),
      $.getJSON('/api/search/popular-words?size=10').then(data => data, (response, result) => result),
      $.getJSON(`/api/home/encyclopedia?lang=${window.ENV.shortLocale}`).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/free/categories?lang=${window.ENV.shortLocale}`).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/football/categories?lang=${window.ENV.shortLocale}`).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/developer/categories?lang=${window.ENV.shortLocale}`).then(data => data, (response, result) => result)
    );

    promises.always((latest, popularSearchWords, encyclopedia, freeCategories, footballCategories, developerCategories) => {
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
      this.categories = {
        FREE: createCategoriesVM.call(this, freeCategories.categories, false),
        FOOTBALL: createCategoriesVM.call(this, footballCategories.categories, false),
        DEVELOPER: createCategoriesVM.call(this, developerCategories.categories, false)
      };
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
          articles: [],
          comments: [],
          galleries: [],
          users: [],
          homeDescription: {}
        },
        popularSearchWords: [],
        encyclopedia: {},
        categories: {}
      };
    },
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('common.jakduk'));
        fetch.call(_this);
      });
    },
    computed: {
      encyclopediaSummary() {
        return `${Truncate({length: 100})(this.encyclopedia.content)}`;
      }
    },
    methods: {
      indexedColor: IndexedColor,
      convertBoardName(id) {
        return this.$t(BoardName(id));
      },
      truncate: Truncate({length: 99})
    },
    filters: {
      IdToRegDate: IdToRegDate
    }
  };
</script>
