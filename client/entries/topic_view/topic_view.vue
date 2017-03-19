<template>
  <div class="topic-view">
    <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
      <i class="list icon"></i>
    </router-link>
    <pager :is-first="!prevPost" :is-last="!nextPost" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
    <div class="pull-right">
      <button @click="toggleNotice" :class="{blue: isNotice}" class="ui toggle button">
        {{$t(isNotice ? 'common.button.cancel.notice' : 'common.button.set.as.notice')}}
      </button>
      <div class="ui buttons">
        <router-link :to="{name: 'board.write', params: {name: $route.params.name}}" class="ui icon button">
          <i class="write icon"></i>
        </router-link>
        <div v-if="isAuthenticated && isEditable" class="ui floating dropdown icon button">
          <i class="dropdown icon"></i>
          <div class="menu">
            <router-link :to="{name: 'board.edit', params: {name: $route.params.name, seq: post.seq}}" class="item">
              <i class="edit icon"></i> {{$t('common.button.edit')}}
            </router-link>
            <button @click="deletePost" class="item">
              <i class="trash icon"></i> {{$t('common.button.delete')}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="ui segments">
      <div class="ui segment">
        <h2>{{(post.status && post.status.delete) ? $t('board.msg.deleted') : post.subject}}</h2>
        <div class="ui grid">
          <div class="sixteen wide mobile eleven wide tablet eleven wide computer column">
            <div v-if="isNotice" class="ui horizontal image basic label">
              <i class="announcement blue icon"></i> {{$t('board.notice')}}
            </div>
            <div :class="categoryColor(post.category.code)" class="ui horizontal label">
              {{$t(categoryLabel(post.category.code))}}
              <div class="detail">{{post.seq}}</div>
            </div>
            <strong v-if="(!post.status || !post.status.delete)">&nbsp;{{post.writer.username}}</strong> &nbsp;
            <span class="nowrap">{{post.id | IdToRegDate('LL')}}</span>
          </div>
          <div class="right aligned sixteen wide mobile five wide tablet five wide computer wide column">
            <i class="eye grey large icon"></i><strong>{{post.views}}</strong> &nbsp;
            <button @click="likeOrDislike('LIKE')">
              <i :style="{'font-weight': post.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue large icon"></i><strong>{{post.numberOfLike}}</strong>
            </button> &nbsp;
            <button @click="likeOrDislike('DISLIKE')">
              <i :style="{'font-weight': post.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="frown pink large icon"></i><strong>{{post.numberOfDislike}}</strong>
            </button>
          </div>
        </div>
      </div>
      <div class="ui blue segment" v-html="post.content"></div>
      <div class="ui center aligned segment">
        <button @click="likeOrDislike('LIKE')" class="ui basic button">
          <i :style="{'font-weight': post.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue large icon"></i><strong>{{post.numberOfLike}}</strong>
        </button>
        <button @click="likeOrDislike('DISLIKE')" class="ui basic button">
          <i :style="{'font-weight': post.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="frown pink large icon"></i><strong>{{post.numberOfDislike}}</strong>
        </button>
      </div>
    </div>

    <div class="text-center">
      <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
        <i class="list icon"></i>
      </router-link>
      <pager :is-first="!prevPost" :is-last="!nextPost" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
    </div>

    <div v-if="latestPostsByWriter && latestPostsByWriter.length" class="ui segments summary-list">
      <h4 class="ui segment">{{$t('latest.articles.author')}}</h4>
      <div class="ui blue segment">
        <div class="ui divided selection relaxed list">
          <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: post.seq}, query: $route.query}" v-for="post in latestPostsByWriter" :key="post.id" class="item">
            <div class="right floated content">
              <div v-if="post.galleries && post.galleries.length" class="ui rounded bordered image thumbnail">
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
      <h4 class="ui segment">{{$t('board.comments')}}</h4>
      <div class="ui blue segment">
        <div class="ui comments">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <a class="avatar">
              <img :src="comment.writer.picture || '/assets/jakduk/img/logo_128.png'">
            </a>
            <div v-if="isAuthenticated && myProfile.id === comment.writer.userId" class="pull-right">
              <button @click="deleteComment(comment)" class="ui icon mini basic button"><i class="remove grey fitted icon"></i></button>
            </div>
            <div class="content">
              <a class="author">{{comment.writer.username}}</a>
              <div class="metadata">
                <span class="date">{{comment.id | IdToRegDate('LL')}}</span>&middot;
                <div class="rating">
                  <button @click="likeOrDislikeComment(comment, 'LIKE')">
                    <i :style="{'font-weight': comment.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue icon"></i> {{comment.numberOfLike}}
                  </button> &nbsp;
                  <button @click="likeOrDislikeComment(comment, 'DISLIKE')">
                    <i :class="{'font-weight': comment.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="frown pink icon"></i> {{comment.numberOfDislike}}
                  </button>
                </div>
              </div>
              <div class="text" v-html="comment.content"></div>
              <!--
              댓글답변 추후기능
              <div class="actions">
                <a class="reply">Reply</a>
              </div>
              -->
            </div>
          </div>

          <div class="comment-form">
            <div v-if="!isAuthenticated" class="ui blue message">{{$t('board.msg.need.login.for.write')}}</div>
            <div class="comment-editor">
              <editor @on-created="onEditorCreated" :options="{language: $store.state.locale}" id="commentEditor" data-mode="comment"></editor>
            </div>
            <div class="clearfix">
              <button @click="submitComment" class="ui right floated blue labeled icon button">
                <i class="icon edit"></i> {{$t('common.button.write.comment')}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .topic-view img {
    max-width: 100%;
    display: block;
    margin: auto;
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

  .comment-form {
    margin-top: 2em;
  }

  .comment-form .comment-editor {
    margin-bottom: 1em;
    border-radius: 0.28571429rem;
    box-shadow: 0 0 0 1px rgba(34, 36, 38, 0.15) inset;
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
  import Editor from '../../components/editor/editor.vue';

  function fetch(seq) {
    return $.when(
      $.getJSON(`/api/board/free/${seq}`).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/free/${seq}/comments`).then(data => data, (response, result) => result)
    );
  }

  function apply(post, comments) {
    post = post === 'error' ? undefined : post;
    comments = comments === 'error' ? undefined : comments;

    if (post) {
      $.extend(this, post);
    }

    if (comments) {
      this.comments = comments.comments;
      this.commentCount = comments.commentCount;
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
        inputComment: ''
      };
    },
    computed: {
      isNotice() {
        return this.post.status && this.post.status.notice;
      },
      isEditable() {
        return !!(this.post.writer && (this.myProfile.id === this.post.writer.userId));
      },
      ...mapState({
        isAuthenticated: 'isAuthenticated',
        isAdmin: 'isAdmin',
        myProfile: 'myProfile'
      })
    },
    beforeRouteEnter(to, from, next) {
      fetch(to.params.seq).then((post, comments) => {
        if (post === 'error') {
          window.alert(Vue.t('common.error.occurred.on.server'));
          next(false);
        } else {
          next(_this => {
            apply.call(_this, post, comments);
            _this.$store.commit('load', false);
          });
        }
      });
    },
    beforeRouteUpdate(to, from, next) {
      fetch(to.params.seq).then((post, comments) => {
        apply.call(this, post, comments);
        next();
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
      $(this.$el).find('img').one('load', () => {
        $('.ui.sticky').sticky('refresh', true);
      });
      $(this.$el).find('.button.dropdown').dropdown();
    },
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      categoryIcon: CategoryIcon,
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
      likeOrDislike(what) {
        $.post(`/api/board/free/${this.post.seq}/${what}`).then(data => {
          this.post.myFeeling = data.myFeeling;
          this.post.numberOfLike = data.numberOfLike;
          this.post.numberOfDislike = data.numberOfDislike;
        }, ErrorDialog(response => {
          if (response.status === 400) {
            return 'board.msg.you.are.writer';
          }
        }));
      },
      likeOrDislikeComment(comment, what) {
        $.post(`/api/board/free/comment/${comment.id}/${what}`).then(data => {
          comment.myFeeling = data.myFeeling;
          comment.numberOfLike = data.numberOfLike;
          comment.numberOfDislike = data.numberOfDislike;
        }, ErrorDialog(response => {
          if (response.status === 400) {
            return 'board.msg.you.are.writer';
          }
        }));
      },
      submitComment() {
        if (!this.$store.state.isAuthenticated) {
          if (window.confirm(this.$t('common.do.you.want.to.login'))) {
            window.location = `/login?redir=${encodeURIComponent(this.$route.fullPath)}`;
          }
          return;
        }

        const commentText = this.commentEditor.getContent({format: 'text'}).trim();
        const existVideo = this.commentEditor.getDoc().querySelector('iframe') || this.commentEditor.getDoc().querySelector('video');
        const existImage = this.commentEditor.getDoc().querySelector('img');

        if (!existVideo && !existImage && (commentText.length < 3 || commentText.length > 800)) {
          window.alert(this.$t('Size.board.comment.content'));
          return;
        }

        $.ajax({
          type: 'post',
          url: '/api/board/free/comment',
          contentType: 'application/json',
          data: JSON.stringify({
            content: this.commentEditor.getContent(),
            seq: this.post.seq
          })
        }).then(data => {
          this.comments.push(data);
          this.commentEditor.setContent('');
        });
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
            content: this.$t(isNotice ? 'board.msg.cancel.notice' : 'board.msg.set.as.notice')
          });
        });
      },
      onEditorCreated(editor) {
        this.commentEditor = editor;
        $('.ui.sticky').sticky('refresh', true);
      }
    },
    components: {
      pager: Pager,
      editor: Editor
    }
  };
</script>
