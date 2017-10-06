<template>
  <div>
    <div class="ui segments">
      <h5 class="ui segment"><i class="blue trophy icon"></i> {{$t('popular.search.words')}}</h5>
      <div class="ui blue segment">
        <router-link v-for="(word, index) in popularSearchWords" :key="word.key" :class="indexedColor(index, false)" :to="{name: 'search', query: {q: word.key, w: 'PO;CO;GA', from: 0, size: 3}}" class="ui label search-keyword">{{word.key}}</router-link>
      </div>
    </div>

    <div v-if="searchResult.postResult" class="ui segments">
      <h5 class="ui segment">
        <i class="blue search icon"></i>
        {{$t('search.post.results', {n: searchResult.postResult.totalCount})}}
        <router-link v-if="searchResult.postResult.totalCount" :to="{name: 'search', query: {q: $route.query.q, w: 'PO'}}" class="pull-right">
          {{$t('common.button.more')}} <i class="chevron right icon"></i>
        </router-link>
      </h5>
      <div class="ui blue segment">
        <div v-if="!searchResult.postResult.posts.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui divided link items">
          <router-link :to="{name: 'board.view', params: {name: result.board.toLowerCase(), seq: result.seq}}" v-for="result in searchResult.postResult.posts" :key="result.id" class="item">
            <div class="content">
              <div v-if="result.highlight.subject" class="header">
                <div v-if="!isEmptyArray(result.galleries)" class="pull-right">
                  <div class="ui rounded bordered image thumbnail">
                    <img :src="result.galleries[0].thumbnailUrl">
                  </div>
                </div>
                <span v-html="result.highlight.subject[0]"></span>
              </div>
              <div v-if="result.highlight.content" v-html="result.highlight.content[0]" class="description"></div>
              <div class="extra">
                <div class="ui small labels">
                  <div v-if="boardCategories[result.board] && boardCategories[result.board][result.category]" :class="[boardCategories[result.board][result.category].color]" class="ui label nomargin">
                    {{convertBoardName(result.board)}} &middot; {{boardCategories[result.board][result.category].name}}
                    <div class="detail">{{result.seq}}</div>
                  </div>
                  <div class="ui image basic label nomargin">
                    <img :src="avatarSrc(result.writer.picture)">
                    {{result.writer.username}}
                    <div class="detail">{{result.id | IdToRegDate('LL')}}</div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="searchResult.commentResult" class="ui segments">
      <h5 class="ui segment">
        <i class="blue search icon"></i>
        {{$t('search.comment.results', {n: searchResult.commentResult.totalCount})}}
        <router-link v-if="searchResult.commentResult.totalCount" :to="{name: 'search', query: {q: $route.query.q, w: 'CO'}}" class="pull-right">
          {{$t('common.button.more')}} <i class="chevron right icon"></i>
        </router-link>
      </h5>
      <div class="ui blue segment">
        <div v-if="!searchResult.commentResult.comments.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui divided link items">
          <router-link :to="{name: 'board.view', params: {name: result.parentBoard.board.toLowerCase(), seq: result.parentBoard.seq}}" v-for="result in searchResult.commentResult.comments" :key="result.id" class="item">
            <div class="content">
              <div v-html="result.highlight.content[0]" class="ui header tiny"></div>
              <div v-html="result.parentBoard.subject" class="extra"></div>
              <div class="extra">
                <div v-if="boardCategories[result.parentBoard.board] && boardCategories[result.parentBoard.board][result.parentBoard.category]" :class="[boardCategories[result.parentBoard.board][result.parentBoard.category].color]" class="ui label nomargin">
                  {{convertBoardName(result.parentBoard.board)}} &middot; {{boardCategories[result.parentBoard.board][result.parentBoard.category].name}}
                  <div class="detail">{{result.parentBoard.seq}}</div>
                </div>
                <div class="ui small image basic label">
                  <img :src="avatarSrc(result.writer.picture)">
                  {{result.writer.username}}
                  <div class="detail">{{result.id | IdToRegDate('LL')}}</div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="searchResult.galleryResult" class="ui segments">
      <h5 class="ui segment">
        <i class="blue search icon"></i>
        {{$t('search.gallery.results', {n: searchResult.galleryResult.totalCount})}}
        <router-link v-if="searchResult.galleryResult.totalCount" :to="{name: 'search', query: {q: $route.query.q, w: 'GA'}}" class="pull-right">
          {{$t('common.button.more')}} <i class="chevron right icon"></i>
        </router-link>
      </h5>
      <div class="ui blue segment">
        <div v-if="!searchResult.galleryResult.galleries.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui link five doubling cards">
          <router-link :to="{name: 'gallery.view', params: {id: result.id}}" v-for="result in searchResult.galleryResult.galleries" :key="result.id" class="card">
            <div class="ui image">
              <img :src="thumbnailSrc(result.id)">
            </div>
            <div class="content">
              <div class="description break-all" v-html="result.highlight.name[0]"></div>
            </div>
            <div class="extra content">
              <div class="author text-overflow">
                <img :src="avatarSrc(result.writer.picture)" class="ui avatar bordered image">
                {{result.writer.username}}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ui.items .item .thumbnail {
    display: block;
    width: 130px;
    margin-left: 6px;
  }

  .ui.items .item .header {
    display: block;
  }
</style>

<script>
  import {mapState} from 'vuex';
  import $ from 'jquery';
  import IdToRegDate from '../../filters/id_to_regdate';
  import IndexedColor from '../../filters/indexed_color';
  import createCategoriesVM from '../../filters/categories_view_model';

  function fetch(query) {
    const promises = [
      $.getJSON('/api/board/free/categories').then(data => data, (response, result) => result),
      $.getJSON('/api/board/football/categories').then(data => data, (response, result) => result),
      $.getJSON('/api/board/developer/categories').then(data => data, (response, result) => result),
      $.getJSON('/api/search/popular/words?size=20').then(data => data, (response, result) => result)
    ];

    if (query.q) {
      promises.push($.getJSON('/api/search', query).then(data => data, (response, result) => result));
    }

    return $.when(...promises);
  }

  function apply(freeCategories, footballCategories, developerCategories, popularSearchWords, searchResult) {
    if (popularSearchWords && popularSearchWords !== 'error') {
      this.$store.commit('popularSearchWords', popularSearchWords.popularSearchWords);
    }

    if (searchResult && searchResult !== 'error') {
      this.$store.commit('searchResult', searchResult);
    }

    if (freeCategories && freeCategories !== 'error') {
      this.$store.commit('boardCategories', {
        id: 'FREE',
        categories: createCategoriesVM.call(this, freeCategories.categories, false)
      });
    }

    if (footballCategories && footballCategories !== 'error') {
      this.$store.commit('boardCategories', {
        id: 'FOOTBALL',
        categories: createCategoriesVM.call(this, footballCategories.categories, false)
      });
    }

    if (developerCategories && developerCategories !== 'error') {
      this.$store.commit('boardCategories', {
        id: 'DEVELOPER',
        categories: createCategoriesVM.call(this, developerCategories.categories, false)
      });
    }

    this.$store.commit('load', false);
  }

  export default {
    beforeRouteEnter(to, from, next) {
      fetch(to.query).then(function () {
        const _arguments = arguments;
        next(_this => {
          _this.setDocumentTitle(_this.$t('search'), _this.$t('common.jakduk'));
          apply.apply(_this, _arguments);
        });
      });
    },
    beforeRouteUpdate(to, from, next) {
      const _this = this;
      fetch(to.query).then(function () {
        const _arguments = arguments;
        _this.setDocumentTitle(_this.$t('search'), _this.$t('common.jakduk'));
        apply.apply(_this, _arguments);
        next();
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
    },
    computed: mapState({
      popularSearchWords: state => state.searchView.popularSearchWords,
      searchResult: state => state.searchView.searchResult,
      boardCategories: state => state.searchView.boardCategories
    }),
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      indexedColor: IndexedColor,
      convertBoardName(id) {
        if (!id) {
          return '';
        }
        return this.$t(`board.name.${id.toLowerCase()}`);
      }
    }
  };
</script>
