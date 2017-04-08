<template>
  <div class="topic-view">
    <!--상단 메뉴 모음-->
    <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
      <i class="list icon"></i>
    </router-link>
    <pager :is-first="!prevPost" :is-last="!nextPost" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
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
      <div v-if="isAuthenticated && (isEditable || isAdmin)" class="ui top right pointing dropdown icon button">
        <i class="icon wrench"></i>
        <div class="menu">
          <button v-if="isAdmin && isNotice" @click="toggleNotice" class="item">
            <i class="arrow circle outline down icon"></i> {{$t('common.button.cancel.notice')}}
          </button>
          <button v-else-if="isAdmin && !isNotice" @click="toggleNotice" class="item">
            <i class="arrow circle outline up icon"></i> {{$t('common.button.set.as.notice')}}
          </button>
          <router-link v-if="isEditable" :to="{name: 'board.edit', params: {name: $route.params.name, seq: post.seq}}" class="item">
            <i class="edit icon"></i> {{$t('common.button.edit')}}
          </router-link>
          <div v-if="isEditable" @click="deletePost" class="item">
            <i class="trash icon"></i> {{$t('common.button.delete')}}
          </div>
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
        <h2>{{(post.status && post.status.delete) ? $t('board.msg.deleted') : post.subject}}</h2>
        <div class="ui grid">
          <div class="sixteen wide mobile eleven wide tablet eleven wide computer column">
            <div class="ui labels">
              <div v-if="isNotice" class="ui basic label nomargin">
                <i class="announcement blue icon"></i> {{$t('board.notice')}}
              </div>
              <div :class="categoryColor(post.category.code)" class="ui label nomargin">
                {{$t(categoryLabel(post.category.code))}}
              <div class="detail">{{post.seq}}</div>
              </div>
              <div class="ui basic image label nomargin">
                <img :src="avatarSrc(post.writer.picture)">
                {{post.writer.username}}
              <div class="detail">{{post.id | IdToRegDate('LL')}}</div>
              </div>
            </div>
          </div>
          <div class="right aligned sixteen wide mobile five wide tablet five wide computer wide column">
            <div class="ui labels">
              <button class="ui basic label nomargin">
                <i class="eye grey icon"></i>{{post.views}}
              </button>
              <button @click="likeOrDislike('LIKE')" :class="post.myFeeling === 'LIKE' ? 'blue' : 'basic'" type="button" class="ui label nomargin">
                <i :style="{'font-weight': post.myFeeling === 'LIKE' ? 'bold' : 'normal'}" :class="{blue: post.myFeeling !== 'LIKE'}" class="smile icon"></i>{{post.numberOfLike}}
              </button>
              <button @click="likeOrDislike('DISLIKE')" :class="post.myFeeling === 'DISLIKE' ? 'teal' : 'basic'" type="button" class="ui  label nomargin">
                <i :style="{'font-weight': post.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" :class="{teal: post.myFeeling !== 'DISLIKE'}" class="meh icon"></i>{{post.numberOfDislike}}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--본문 콘텐트-->
      <div class="ui blue segment ql-editor" v-html="post.content"></div>

      <div v-if="!isEmptyArray(post.galleries)" class="ui segment">
        <h5>{{$t('board.gallery.list')}}</h5>
        <p v-for="file in post.galleries">
          <router-link :to="{name: 'gallery.view', params: {id: file.id}}">
            <i class="icon attach"></i> {{file.name}}
          </router-link>
        </p>
      </div>

      <!--하단 좋아요-->
      <div class="ui center aligned segment">
        <button @click="likeOrDislike('LIKE')" :class="post.myFeeling === 'LIKE' ? 'blue' : 'basic'" class="ui compact button">
          <i :style="{'font-weight': post.myFeeling === 'LIKE' ? 'bold' : 'normal'}" :class="{blue: post.myFeeling !== 'LIKE'}" class="smile icon"></i><strong>{{post.numberOfLike}}</strong>
        </button>
        <button @click="likeOrDislike('DISLIKE')" :class="post.myFeeling === 'DISLIKE' ? 'teal' : 'basic'" class="ui compact button">
          <i :style="{'font-weight': post.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" :class="{teal: post.myFeeling !== 'DISLIKE'}" class="meh icon"></i><strong>{{post.numberOfDislike}}</strong>
        </button>
      </div>
    </div>

    <div class="text-center">
      <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
        <i class="list icon"></i>
      </router-link>
      <pager :is-first="!prevPost" :is-last="!nextPost" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
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
    <div v-if="!isEmptyArray(latestPostsByWriter)" class="ui segments summary-list">
      <h4 class="ui segment"><i class="blue feed icon"></i> {{$t('latest.articles.author')}}</h4>
      <div class="ui blue segment">
        <div class="ui divided selection relaxed list">
          <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: post.seq}, query: $route.query}" v-for="post in latestPostsByWriter" :key="post.id" class="item">
            <div v-if="!isEmptyArray(post.galleries)" class="right floated content">
              <div class="ui rounded bordered image thumbnail">
                <img :src="post.galleries[0].thumbnailUrl">
              </div>
            </div>
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

    <!--코멘트-->
    <div class="ui segments">
      <h4 class="ui segment"><i class="blue talk icon"></i> {{$t('board.comments')}}</h4>
      <div class="ui blue segment">

        <div class="ui comments">
          <p v-if="isEmptyArray(comments)">
            <i class="icon idea"></i>{{$t('board.msg.there.is.no.new.comment')}}
          </p>
          <comment-list-item :item="comment" v-for="comment in comments" :key="comment.id" @on-like="likeOrDislikeComment(comment, 'LIKE')" @on-dislike="likeOrDislikeComment(comment, 'DISLIKE')" @on-delete="deleteComment"></comment-list-item>
        </div>

        <button @click="moreComments" :class="{loading: isCommentLoading}" type="button" class="fluid ui button">
          <i class="icon history"></i> {{$t('common.button.more')}}
        </button>

        <div class="ui divider"></div>

        <div class="comment-form">
          <div v-if="!isAuthenticated" class="ui blue message">{{$t('board.msg.need.login.for.write')}}</div>
          <div class="comment-editor">
            <editor @on-created="onEditorCreated" :options="{mode: 'comment', language: $store.state.locale}"></editor>
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
    height: auto;
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
  import Vue from 'vue';
  import {mapState} from 'vuex';
  import $ from 'jquery';
  import Pager from '../../components/pager/pager.vue';
  import IdToRegDate from '../../filters/id_to_regdate';
  import CategoryColor from '../../filters/category_color';
  import CategoryIcon from '../../filters/category_icon';
  import CategoryLabel from '../../filters/category_label';
  import ErrorDialog from '../../utils/dialog_response_error';
  import CommentListItem from '../../components/comment_list_item/comment_list_item.vue';

  function fetch(seq) {
    return $.getJSON(`/api/board/free/${seq}`).then(data => {
      return data;
    }, response => response).then(post => {
      return $.getJSON(`/api/board/free/${seq}/comments`).then(data => {
        return {
          post: post,
          comments: data
        }
      });
    }, response => response);
  }

  function apply(post, comments) {
    $.extend(this, post);
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
        post: {
          id: '',
          category: {},
          writer: {},
          numberOfLike: 0,
          numberOfDislike: 0
        },
        latestPostsByWriter: [],
        nextPost: {},
        prevPost: {},
        comments: [],
        isCommentSubmitting: false,
        isCommentLoading: true
      };
    },
    beforeRouteEnter(to, from, next) {
      fetch(to.params.seq).then(({post, comments}) => {
        next(_this => {
          apply.call(_this, post, comments);
        });
      }, response => {
        next(_this => {
          error.call(_this, response);
        });
      });
    },
    beforeRouteUpdate(to, from, next) {
      fetch(to.params.seq).then(({post, comments}) => {
        apply.call(this, post, comments);
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
    },
    computed: {
      isNotice() {
        return this.post.status && this.post.status.notice;
      },
      isEditable() {
        return !!(this.post.writer && (this.myProfile.id === this.post.writer.userId));
      },
      kakaoShareOptions() {
        return {
          kakaoClientId: this.$store.state.kakaoClientID,
          label: this.post.subject,
          url: `${window.location.origin}${this.$route.fullPath}`,
          thumbnailUrl: (this.post.galleries && this.post.galleries[0] && this.post.galleries[0].imageUrl) || `${window.location.origin}/assets/jakduk/img/logo_256.png`
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
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      categoryIcon: CategoryIcon,
      onEditorCreated(editor) {
        this.commentEditor = editor;
        $('.ui.sticky').sticky('refresh', true);
      },
      prevTopic() {
        this.$router.push({
          name: 'board.view',
          params: {
            name: this.$route.params.name,
            seq: this.prevPost.seq
          },
          query: this.$route.query
        });
      },
      nextTopic() {
        this.$router.push({
          name: 'board.view',
          params: {
            name: this.$route.params.name,
            seq: this.nextPost.seq
          },
          query: this.$route.query
        });
      },
      toggleNotice() {
        const isNotice = this.isNotice;

        $.ajax({
          type: isNotice ? 'delete' : 'post',
          url: `/api/board/free/${this.post.seq}/notice`
        }).then(() => {
          if (!this.post.status) {
            this.post.status = {};
          }

          this.post.status.notice = !isNotice;

          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t(isNotice ? 'board.msg.cancel.notice' : 'board.msg.set.as.notice')
          });
        });
      },
      copyLinkIntoClipboard() {
        window.prompt(this.$t('common.url.of.name', {name: this.post.subject}), `${window.location.origin}${this.$route.fullPath}`);
      },
      likeOrDislike(what) {
        $.post(`/api/board/free/${this.post.seq}/${what}`).then(data => {
          this.post.myFeeling = data.myFeeling;
          this.post.numberOfLike = data.numberOfLike;
          this.post.numberOfDislike = data.numberOfDislike;
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
            url: `/api/board/free/${this.post.seq}`
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
        $.post(`/api/board/free/comment/${comment.id}/${what}`).then(data => {
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
            url: `/api/board/free/comment/${comment.id}`
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

        $.getJSON(`/api/board/free/${this.post.seq}/comments${lastComment ? `?commentId=${lastComment.id}` : ''}`).then(data => {
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
        if ((text.length < 3 || text.length > 800) && !this.commentEditor.hasEmbed()) {
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
          url: '/api/board/free/comment',
          contentType: 'application/json',
          data: JSON.stringify({
            content: this.commentEditor.getContents(),
            seq: this.post.seq
          })
        }).then(data => {
          this.comments.push(data);
          this.commentEditor.clear();
        }, ...response => {
          this.$store.dispatch('globalMessage', {
            level: 'error',
            message: response[2]
          });
        }).always(() => {
          this.isCommentSubmitting = false;
        });
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
