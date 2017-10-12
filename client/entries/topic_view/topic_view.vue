<template>
  <div class="topic-view">
    <!--상단 메뉴 모음-->
    <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
      <i class="list icon"></i>
    </router-link>
    <pager :is-first="!prevArticle" :is-last="!nextArticle" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
    <div class="pull-right">
      <div v-if="isAuthenticated && (isEditable || isAdmin)" class="ui top right pointing dropdown icon button">
        <i class="icon wrench"></i>
        <div class="menu">
          <button v-if="isAdmin && isNotice" @click="toggleNotice" class="item">
            <i class="arrow circle outline down icon"></i> {{$t('common.button.cancel.notice')}}
          </button>
          <button v-else-if="isAdmin && !isNotice" @click="toggleNotice" class="item">
            <i class="arrow circle outline up icon"></i> {{$t('common.button.set.as.notice')}}
          </button>
          <router-link v-if="isEditable" :to="{name: 'board.edit', params: {name: $route.params.name, seq: article.seq}}" class="item">
            <i class="edit icon"></i> {{$t('common.button.edit')}}
          </router-link>
          <div v-if="isEditable" @click="deletePost" class="item">
            <i class="trash icon"></i> {{$t('common.button.delete')}}
          </div>
        </div>
      </div>
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
      <router-link :to="{name: 'board.write', params: {name: $route.params.name}}" class="ui icon button">
        <i class="write icon"></i>
      </router-link>
    </div>

    <!--본문-->
    <div class="ui segments">
      <!--본문 메타 데이터-->
      <div class="ui segment">
        <h2>{{(article.status && article.status.delete) ? $t('board.msg.deleted') : article.subject}}</h2>
        <div class="ui grid">
          <div class="sixteen wide mobile eleven wide tablet eleven wide computer column">
            <div class="ui labels">
              <div v-if="isNotice" class="ui basic label nomargin">
                <i class="announcement blue icon"></i> {{$t('board.notice')}}
              </div>
              <div v-if="article.category" :class="categories[article.category.code].color" class="ui label nomargin">
                {{categories[article.category.code].name}}
              <div class="detail">{{article.seq}}</div>
              </div>
              <div class="ui basic image label nomargin">
                <template v-if="article.writer">
                  <img :src="avatarSrc(article.writer.picture)">
                  {{article.writer.username}}
                </template>
              <div class="detail">{{article.id | IdToRegDate('LL')}}</div>
              </div>
            </div>
          </div>
          <div class="right aligned sixteen wide mobile five wide tablet five wide computer wide column">
            <div class="ui labels">
              <button class="ui basic label nomargin">
                <i class="eye grey icon"></i>{{article.views}}
              </button>
              <button @click="likeOrDislike('like')" :class="article.myFeeling === 'LIKE' ? 'blue' : 'basic'" type="button" class="ui label nomargin">
                <i :style="{'font-weight': article.myFeeling === 'LIKE' ? 'bold' : 'normal'}" :class="{blue: article.myFeeling !== 'LIKE'}" class="smile icon"></i>{{article.numberOfLike}}
              </button>
              <button @click="likeOrDislike('dislike')" :class="article.myFeeling === 'DISLIKE' ? 'teal' : 'basic'" type="button" class="ui  label nomargin">
                <i :style="{'font-weight': article.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" :class="{teal: article.myFeeling !== 'DISLIKE'}" class="meh icon"></i>{{article.numberOfDislike}}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--본문 콘텐트-->
      <div class="ui blue segment ql-editor" v-html="article.content"></div>

      <div v-if="!isEmptyArray(article.galleries)" class="ui segment">
        <h5>{{$t('board.gallery.list')}}</h5>
        <p v-for="file in article.galleries">
          <router-link :to="{name: 'gallery.view', params: {id: file.id}}">
            <i class="icon attach"></i> {{file.name}}
          </router-link>
        </p>
      </div>

      <!--하단 좋아요-->
      <div class="ui center aligned segment">
        <button @click="likeOrDislike('like')" :class="article.myFeeling === 'LIKE' ? 'blue' : 'basic'" class="ui compact button">
          <i :style="{'font-weight': article.myFeeling === 'LIKE' ? 'bold' : 'normal'}" :class="{blue: article.myFeeling !== 'LIKE'}" class="smile icon"></i><strong>{{article.numberOfLike}}</strong>
        </button>
        <button @click="likeOrDislike('dislike')" :class="article.myFeeling === 'DISLIKE' ? 'teal' : 'basic'" class="ui compact button">
          <i :style="{'font-weight': article.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" :class="{teal: article.myFeeling !== 'DISLIKE'}" class="meh icon"></i><strong>{{article.numberOfDislike}}</strong>
        </button>
      </div>
    </div>

    <div class="text-center">
      <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
        <i class="list icon"></i>
      </router-link>
      <pager :is-first="!prevArticle" :is-last="!nextArticle" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
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

    <!--작성자의 최근 게시물-->
    <div v-if="!isEmptyArray(latestArticlesByWriter)" class="ui segments summary-list">
      <h4 class="ui segment"><i class="blue feed icon"></i> {{$t('latest.articles.author')}}</h4>
      <div class="ui blue segment">
        <div class="ui divided selection relaxed list">
          <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: article.seq}, query: $route.query}" v-for="article in latestArticlesByWriter" :key="article.id" class="item">
            <div v-if="!isEmptyArray(article.galleries)" class="right floated content">
              <div class="ui rounded bordered image thumbnail">
                <img :src="article.galleries[0].thumbnailUrl">
              </div>
            </div>
            <div class="content">
              <div class="header">{{article.subject}}</div>
              <div class="extra">
                <strong>{{article.writer.username}}</strong> &middot; {{article.id | IdToRegDate('LL')}}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!--코멘트-->
    <div class="ui segments">
      <h4 class="ui segment"><i class="blue talk icon"></i> {{$t('board.comments')}}</h4>
      <div class="ui blue segment">

        <div class="ui comments">
          <p v-if="isEmptyArray(comments)">
            <i class="icon idea"></i>{{$t('board.msg.there.is.no.new.comment')}}
          </p>
          <comment-list-item v-for="comment in comments" :item="comment" :key="comment.id" @on-like="likeOrDislikeComment(comment, 'like')" @on-dislike="likeOrDislikeComment(comment, 'dislike')" @on-delete="deleteComment"></comment-list-item>
        </div>

        <button @click="moreComments" :class="{loading: isCommentLoading}" type="button" class="fluid ui button">
          <i class="icon history"></i> {{$t('common.button.more')}}
        </button>

        <div class="ui divider"></div>

        <div class="comment-form">
          <div v-if="!isAuthenticated" class="ui blue message">{{$t('board.msg.need.login.for.write')}}</div>
          <div class="comment-editor">
            <editor @on-created="onEditorCreated" @on-image-uploaded="onImageUploaded" :options="{mode: 'comment', language: $lang.split('-')[0]}"></editor>
          </div>
          <div class="clearfix">
            <button @click="checkCommentForm() && submitComment()" :class="{loading: isCommentSubmitting}" class="ui right floated blue labeled icon button">
              <i class="icon edit"></i> {{$t('common.button.write.comment')}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

<style>
  .topic-view img {
    max-width: 100%;
    border-radius: 0.28571429rem;
  }
  .topic-view .ui.comments {
    max-width: inherit;
  }

  .topic-view .img-responsive,
  .topic-view .note-video-clip,
  .comment .content img,
  .comment .content video {
    max-width: 100%;
  }

  .ui.segment.ql-editor {
    padding: 2em;
  }

  .ui.segment.ql-editor .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
  }

  .ui.segment.ql-editor .ql-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .comment .content iframe {
    max-width: 100%;
    border: 0;
  }

  .comment .text.ql-editor {
    padding: 0 1em 0 0;
  }

  .comment-form {
    margin-top: 1.5em;
  }

  .comment-form .comment-editor {
    margin-bottom: 1em;
    height: 200px;
  }
</style>

<script>
  import {mapState} from 'vuex';
  import $ from 'jquery';
  import Pager from '../../components/pager/pager.vue';
  import IdToRegDate from '../../filters/id_to_regdate';
  import ErrorDialog from '../../utils/dialog_response_error';
  import CommentListItem from '../../components/comment_list_item/comment_list_item.vue';
  import createCategoriesVM from '../../filters/categories_view_model';

  let commentEdiotImageList = [];

  function fetch({name, seq}) {
    return $.getJSON(`/api/board/${name}/categories?lang=${window.ENV.locale.split('-')[0]}`).then(data => {
      return data;
    }, response => response).then(categories => {
      return $.getJSON(`/api/board/${name}/${seq}`).then(data => {
        return data;
      }, response => response).then(article => {
        return $.getJSON(`/api/board/${name}/${seq}/comments`).then(data => {
          return {
            categories: categories,
            article: article,
            comments: data
          }
        });
      }, response => response);
    });
  }

  function apply(categories, article, comments) {
    this.prevArticle = null;
    this.nextArticle = null;
    $.extend(this, article);
    this.categories = createCategoriesVM.call(this, categories.categories, true);
    this.comments = comments.comments;
    this.commentCount = comments.commentCount;
    this.isCommentLoading = false;
    this.$store.commit('load', false);
  }

  function error(response) {
    if (response.status !== 404) {
      window.alert(this.$t('common.error.occurred.on.server'));
      this.$router.replace(`/board/${this.$route.params.name}`);
    } else {
      this.$router.replace(`/page_not_found`);
    }
  }

  export default {
    data() {
      return {
        categories: {
          ALL: {},
          list: []
        },
        article: {
          id: '',
          category: {
            code: 'ALL'
          },
          writer: {},
          numberOfLike: 0,
          numberOfDislike: 0
        },
        latestArticlesByWriter: [],
        nextArticle: null,
        prevArticle: null,
        comments: [],
        isCommentSubmitting: false,
        isCommentLoading: true
      };
    },
    beforeRouteEnter(to, from, next) {
      fetch(to.params).then(({categories, article, comments}) => {
        next(_this => {
          _this.setDocumentTitle(
            (article.article.status && article.article.status.delete) ? _this.$t('board.msg.deleted') : article.article.subject,
            _this.$t('board.name.free'),
            _this.$t('common.jakduk')
          );
          apply.call(_this, categories, article, comments);
        });
      }, response => {
        next(_this => {
          error.call(_this, response);
        });
      });
    },
    beforeRouteUpdate(to, from, next) {
      fetch(to.params).then(({categories, article, comments}) => {
        apply.call(this, categories, article, comments);
        next();
      }, response => {
        error.call(this, response);
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
      $(this.$el).find('img').one('load', () => {
        $('.ui.sticky').sticky('refresh', true);
      });
      $(this.$el).find('.button.dropdown').dropdown();
      $('.ql-editor .ql-video').each((index, element) => {
        const $video = $(element);
        if (!$video.parent().hasClass('video-container')) {
          $video.wrapAll('<div class="video-container"/>');
        }
      });
    },
    computed: {
      isNotice() {
        return this.article.status && this.article.status.notice;
      },
      isEditable() {
        return !!(this.article.writer && (this.myProfile.id === this.article.writer.userId));
      },
      kakaoShareOptions() {
        return {
          kakaoClientId: this.$store.state.kakaoClientID,
          label: this.article.subject,
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: (this.article.galleries && this.article.galleries[0] && this.article.galleries[0].imageUrl) || `${window.location.origin}/assets/jakduk/img/logo_256.png`
        }
      },
      ...mapState({
        isAuthenticated: 'isAuthenticated',
        isAdmin: 'isAdmin',
        isMobile: 'isMobile',
        myProfile: 'myProfile'
      })
    },
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      onEditorCreated(editor) {
        this.commentEditor = editor;
        $('.ui.sticky').sticky('refresh', true);
      },
      prevTopic() {
        this.$router.push({
          name: 'board.view',
          params: {
            name: this.$route.params.name,
            seq: this.prevArticle.seq
          },
          query: this.$route.query
        });
      },
      nextTopic() {
        this.$router.push({
          name: 'board.view',
          params: {
            name: this.$route.params.name,
            seq: this.nextArticle.seq
          },
          query: this.$route.query
        });
      },
      toggleNotice() {
        const isNotice = this.isNotice;

        $.ajax({
          type: isNotice ? 'delete' : 'post',
          url: `/api/board/${this.$route.params.name}/${this.article.seq}/notice`
        }).then(() => {
          if (!this.article.status) {
            this.article.status = {};
          }

          this.article.status.notice = !isNotice;

          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t(isNotice ? 'board.msg.cancel.notice' : 'board.msg.set.as.notice')
          });
        });
      },
      copyLinkIntoClipboard() {
        window.prompt(
          this.$t('common.url.of.name', {name: this.article.subject}),
          `${window.location.origin}${window.location.pathname}`
        );
      },
      likeOrDislike(what) {
        $.post(`/api/board/${this.$route.params.name}/${this.article.seq}/${what}`).then(data => {
          this.article.myFeeling = data.myFeeling;
          this.article.numberOfLike = data.numberOfLike;
          this.article.numberOfDislike = data.numberOfDislike;
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
      deletePost() {
        if (window.confirm(this.$t('board.msg.confirm.delete.post'))) {
          $.ajax({
            type: 'delete',
            url: `/api/board/${this.$route.params.name}/${this.article.seq}`
          }).then(() => {
            this.$router.replace({
              name: 'board',
              params: {
                name: this.$route.params.name
              }
            });
          });
        }
      },
      likeOrDislikeComment(comment, what) {
        $.post(`/api/board/${this.$route.params.name}/comment/${comment.id}/${what}`).then(data => {
          comment.myFeeling = data.myFeeling;
          comment.numberOfLike = data.numberOfLike;
          comment.numberOfDislike = data.numberOfDislike;
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
      deleteComment(comment) {
        if (window.confirm(this.$t('common.do.you.want.to.delete.a.comment'))) {
          $.ajax({
            type: 'delete',
            url: `/api/board/${this.$route.params.name}/comment/${comment.id}`
          }).then(() => {
            const index = this.comments.findIndex(_comment => _comment.id === comment.id);
            this.comments.splice(index, 1);
          });
        }
      },
      moreComments() {
        if (this.isCommentLoading) {
          return;
        }

        const lastComment = this.comments[this.comments.length - 1];

        this.isCommentLoading = true;

        $.getJSON(`/api/board/${this.$route.params.name}/${this.article.seq}/comments${lastComment ? `?commentId=${lastComment.id}` : ''}`).then(data => {
          if (data.comments.length) {
            this.comments.splice(this.comments.length, 0, ...data.comments);
          } else {
            this.$store.dispatch('globalMessage', {
              level: 'info',
              message: this.$t('board.msg.there.is.no.new.comment')
            });
          }
        }, response => {
          this.$store.dispatch('globalMessage', {
            level: 'error',
            message: response[2]
          });
        }).always(() => {
          this.isCommentLoading = false;
        });
      },
      checkCommentForm() {
        if (!this.$store.state.isAuthenticated) {
          if (window.confirm(this.$t('common.do.you.want.to.login'))) {
            window.location = `/login?redir=${encodeURIComponent(this.$route.fullPath)}`;
          }
          return false;
        }

        if (this.isCommentSubmitting) {
          return false;
        }

        const text = this.commentEditor.getText().trim();
        if ((!text.length || text.length > 800) && !this.commentEditor.hasEmbed()) {
          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t('Size.board.comment.content')
          });
          this.commentEditor.focus();
          return false;
        }

        return true;
      },
      submitComment() {
        this.isCommentSubmitting = true;

        $.ajax({
          type: 'post',
          url: `/api/board/${this.$route.params.name}/${this.article.seq}/comment`,
          contentType: 'application/json',
          data: JSON.stringify({
            content: this.commentEditor.getContents(),
            galleries: this.commentEditor.getEmbeds().reduce((list, embed) => {
              const image = commentEdiotImageList.find(image => image.imageUrl === embed.image);

              if (embed.image && image) {
                list.push({
                  id: image.id,
                  name: image.name
                });
              }

              return list;
            }, [])
          })
        }).then(data => {
          this.comments.push(data);
          this.commentEditor.clear();
          commentEdiotImageList = [];
        }, ...response => {
          this.$store.dispatch('globalMessage', {
            level: 'error',
            message: response[2]
          });
        }).always(() => {
          this.isCommentSubmitting = false;
        });
      },
      onImageUploaded(image) {
        image.name = image.name || image.fileName;
        commentEdiotImageList.push(image);
      }
    },
    components: {
      pager: Pager,
      'comment-list-item': CommentListItem,
      editor: resolve => {
        require.ensure([], require => {
          resolve(require('../../components/editor/editor.vue'));
        }, 'editor');
      },
      'kakao-share': resolve => {
        require.ensure([], require => {
          resolve(require('../../components/kakao_share/kakao_share.vue'));
        }, 'kakao_share');
      }
    }
  };
</script>
