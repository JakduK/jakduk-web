<template>
  <div>
    <div class="ui segments">
      <h5 class="ui segment"><i class="blue trophy icon"></i> {{$t('popular.search.words')}}</h5>
      <div class="ui segment">
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
      <div class="ui segment">
        <div v-if="!searchResult.postResult.posts.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui divided link items">
          <router-link :to="{name: 'board.view', params: {name:'free', seq: result.seq}}" v-for="result in searchResult.postResult.posts" :key="result.id" class="item">
            <div class="content">
              <div v-if="result.highlight.subject" v-html="result.highlight.subject[0]" class="header"></div>
              <div v-if="result.highlight.content" v-html="result.highlight.content[0]" class="description"></div>
              <div class="extra">
                <div :class="categoryColor(result.category)" class="ui label">
                  {{$t(categoryLabel(result.category))}}
                  <div class="detail">{{result.seq}}</div>
                </div>
                <div :class="{image: result.writer.picture}" class="ui basic label">
                  <img v-if="result.writer.picture" :src="result.writer.picture">
                  <i v-else class="icon spy"></i>
                  {{result.writer.username}}
                  <div class="detail">{{result.id | IdToRegDate('LL')}}</div>
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
      <div class="ui segment">
        <div v-if="!searchResult.commentResult.comments.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui divided link items">
          <router-link :to="{name: 'board.view', params: {name:'free', seq: result.parentBoard.seq}}" v-for="result in searchResult.commentResult.comments" :key="result.id" class="item">
            <div class="content">
              <div v-html="result.highlight.content[0]" class="ui header tiny"></div>
              <div v-html="result.parentBoard.subject" class="extra"></div>
              <div class="extra">
                <div :class="{image: result.writer.picture}" class="ui basic label">
                  <img v-if="result.writer.picture" :src="result.writer.picture">
                  <i v-else class="icon spy"></i>
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
      <div class="ui segment">
        <div v-if="!searchResult.galleryResult.galleries.length">
          <i class="icon idea"></i> {{$t('search.no.result')}}
        </div>
        <div v-else class="ui link five doubling cards">
          <a v-for="result in searchResult.galleryResult.galleries" :key="result.id" class="card">
            <div class="ui image">
              <img :src="'https://staging.jakduk.com:8080/gallery/thumbnail/' + result.id">
            </div>
            <div class="content">
              <div class="description break-all" v-html="result.highlight.name[0]"></div>
            </div>
            <div class="extra content">
              <div class="author text-overflow">
                <img v-if="result.writer.picture" :src="result.writer.picture" class="ui avatar image">
                <i class="spy large icon"></i>
                {{result.writer.username}}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import $ from 'jquery';
  import CategoryColor from '../../filters/category_color';
  import CategoryLabel from '../../filters/category_label';
  import IdToRegDate from '../../filters/id_to_regdate';
  import IndexedColor from '../../filters/indexed_color';

  function fetch(query) {
    const promises = [$.getJSON('/api/search/popular/words?size=20').then(data => data, (response, result) => result)];

    if (query.q) {
      promises.push($.getJSON('/api/search', query).then(data => data, (response, result) => result));
    }

    return $.when(...promises);
  }

  function apply(popularSearchWords, searchResult) {
    if (popularSearchWords && popularSearchWords !== 'error') {
      this.$store.commit('popularSearchWords', popularSearchWords.popularSearchWords);
    }

    if (searchResult && searchResult !== 'error') {
      this.$store.commit('searchResult', searchResult);
    }

    this.$store.commit('load', false);
  }

  export default {
    beforeRouteEnter(to, from, next) {
      fetch(to.query).then((popularSearchWords, searchResult) => {
        next(_this => {
          apply.call(_this, popularSearchWords, searchResult);
        });
      });
    },
    beforeRouteUpdate(to, from, next) {
      fetch(to.query).then((popularSearchWords, searchResult) => {
        apply.call(this, popularSearchWords, searchResult);
        next();
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
    },
    computed: mapState({
      popularSearchWords: state => state.searchView.popularSearchWords,
      searchResult: state => state.searchView.searchResult
    }),
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      indexedColor: IndexedColor
    }
  };
</script>
