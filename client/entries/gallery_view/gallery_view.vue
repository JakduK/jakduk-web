<template>
  <div class="gallery-view">
    <!--상단 메뉴 모음-->
    <router-link :to="{name: 'gallery', query: $route.query}" class="ui icon basic button">
      <i class="list icon"></i>
    </router-link>
    <pager :is-first="!prevImage" :is-last="!nextImage" @on-prev="prev" @on-next="next" class="inline"></pager>
    <div class="pull-right">
      <div class="ui top right pointing dropdown icon button">
        <i class="icon share alternate"></i>
        <div class="menu">
          <div @click="copyLinkIntoClipboard" class="item">
            <i class="linkify icon"></i> {{$t('common.button.copy.url.to.clipboard')}}
          </div>
          <kakao-share v-if="isMobile" :options="kakaoShareOptions" tag="div" class="item">
            <img src="../../components/kakao_share/kakaolink_btn_small.png" class="item-icon-kakao"> {{$t('common.send.url.via.kakaotalk')}}
          </kakao-share>
        </div>
      </div>
    </div>

    <!--본문-->
    <div class="ui segments">
      <!--본문 메타 데이터-->
      <div class="ui segment">
        <h2 class="break-all">{{image.name}}</h2>
        <div class="ui grid">
          <div class="sixteen wide mobile eleven wide tablet eleven wide computer column">
            <div :class="{image: image.writer.picture}" class="ui basic label">
              <img v-if="image.writer.picture" :src="image.writer.picture">
              <i v-else class="icon spy"></i>
              {{image.writer.username}}
              <div class="detail">{{image.id | IdToRegDate('LL')}}</div>
            </div>
          </div>
          <div class="right aligned sixteen wide mobile five wide tablet five wide computer wide column">
            <span>
              <i class="eye grey large icon"></i><strong>{{image.views}}</strong> &nbsp;
            </span>
            <button @click="likeOrDislike('LIKE')">
              <i :style="{'font-weight': image.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue large icon"></i><strong>{{image.numberOfLike}}</strong>
            </button> &nbsp;
            <button @click="likeOrDislike('DISLIKE')">
              <i :style="{'font-weight': image.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="meh teal large icon"></i><strong>{{image.numberOfDislike}}</strong>
            </button>
          </div>
        </div>
      </div>
      <!--본문 콘텐트-->
      <div class="ui blue segment text-center">
        <img :src="imageSrc(image.id)">
      </div>
      <div class="ui center aligned segment">
        <button @click="likeOrDislike('LIKE')" class="ui compact basic button">
          <i :style="{'font-weight': image.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue large icon"></i><strong>{{image.numberOfLike}}</strong>
        </button>
        <button @click="likeOrDislike('DISLIKE')" class="ui compact basic button">
          <i :style="{'font-weight': image.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="meh teal large icon"></i><strong>{{image.numberOfDislike}}</strong>
        </button>
      </div>
    </div>

    <!--하단 좋아요-->
    <div class="text-center">
      <router-link :to="{name: 'gallery', query: $route.query}" class="ui icon basic button">
        <i class="list icon"></i>
      </router-link>
      <pager :is-first="!prevImage" :is-last="!nextImage" @on-prev="prev" @on-next="next" class="inline"></pager>
    </div>

    <!--하단 공유-->
    <div class="shares text-center">
      <button @click="copyLinkIntoClipboard" type="button" class="ui icon button">
        <i class="linkify icon"></i>
      </button>
      <kakao-share v-if="isMobile" :options="kakaoShareOptions" tag="button" type="button" class="button-kakao">
        <img src="../../components/kakao_share/kakaolink_btn_medium.png">
      </kakao-share>
    </div>

    <!--엮인글-->
    <div v-if="!isEmptyArray(linkedPosts)" class="ui segments summary-list">
      <h4 class="ui segment"><i class="blue linkify icon"></i> {{$t('gallery.linked.posts')}}</h4>
      <div class="ui blue segment">
        <div class="ui divided selection relaxed list">
          <router-link :to="{name: 'board.view', params: {name: 'free', seq: post.seq}}" v-for="post in linkedPosts" :key="post.id" class="item">
            <div class="content">
              <div class="header">{{post.subject}}</div>
              <div class="extra">
                <strong>{{post.writer.username}}</strong> &middot; {{post.id | IdToRegDate('LL')}}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gallery-view img {
    max-width: 100%;
    border-radius: 0.28571429rem;
  }

  .button-kakao {
    height: 36px;
    vertical-align: top;
  }

  .button-kakao > img {
    height: 100%;
  }

  .item .item-icon-kakao {
    height: 14px !important;
  }

  .shares {
    margin-top: 1rem;
  }
</style>

<script>
  import {mapState} from 'vuex';
  import $ from 'jquery';
  import Pager from '../../components/pager/pager.vue';
  import IdToRegDate from '../../filters/id_to_regdate';
  import ErrorDialog from '../../utils/dialog_response_error';

  export default {
    beforeRouteEnter(to, from, next) {
      $.getJSON(`/api/gallery/${to.params.id}`).then(data => {
        next(_this => {
          _this.$store.commit('image', data);
          _this.$store.commit('load', false);
        })
      });
    },
    beforeRouteUpdate(to, from, next) {
      $.getJSON(`/api/gallery/${to.params.id}`).then(data => {
        this.$store.commit('image', data);
        this.$store.commit('load', false);
        next();
      });
    },
    mounted() {
      $(this.$el).find('.button.dropdown').dropdown();
    },
    updated() {
      $(this.$el).find('img').one('load', () => {
        $('.ui.sticky').sticky('refresh', true);
      });
    },
    computed: {
      kakaoShareOptions() {
        return {
          kakaoClientId: this.$store.state.kakaoClientID,
          label: this.image.name,
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: this.imageSrc(this.image.id)
        }
      },
      ...mapState({
        isMobile: 'isMobile',
        image: state => state.galleryView.image,
        nextImage: state => state.galleryView.next,
        prevImage: state => state.galleryView.prev,
        linkedPosts: state => state.galleryView.linkedPosts,
      })
    },
    methods: {
      prev() {
        this.$router.push({
          name: 'gallery.view',
          params: {
            id: this.prevImage.id
          }
        });
      },
      next() {
        this.$router.push({
          name: 'gallery.view',
          params: {
            id: this.nextImage.id
          }
        });
      },
      likeOrDislike(what) {
        $.post(`/api/gallery/${this.image.id}/${what}`).then(data => {
          this.$store.commit('feeling', data);
        }, ErrorDialog(response => {
          if (response.status === 400) {
            this.$store.dispatch('globalMessage', {
              level: 'warn',
              message: this.$t('board.msg.you.are.writer')
            });
            return true;
          }
        }));
      },
      copyLinkIntoClipboard() {
        window.prompt(this.$t('common.url.of.name', {
          name: this.image.name
        }), `${window.location.origin}${this.$route.fullPath}`);
      }
    },
    filters: {
      IdToRegDate: IdToRegDate
    },
    components: {
      pager: Pager,
      'kakao-share': resolve => {
        require.ensure([], require => {
          resolve(require('../../components/kakao_share/kakao_share.vue'));
        }, 'kakao_share');
      }
    }
  };
</script>
