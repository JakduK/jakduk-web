<template>
  <div class="topic-view">
    <router-link :to="{name: 'board', params: {name: $route.params.name}, query: $route.query}" class="ui icon basic button">
      <i class="list icon"></i>
    </router-link>
    <pager :is-first="!prevPost" :is-last="!nextPost" @on-prev="prevTopic" @on-next="nextTopic" class="inline"></pager>
    <router-link :to="{name: 'board.write', params: {name: $route.params.name}}" class="ui icon button pull-right">
      <i class="write icon"></i>
    </router-link>
    <div class="ui segments">
      <div class="ui segment">
        <h2>{{(post.status && post.status.delete) ? $t('board.msg.deleted') : post.subject}}</h2>
        <div class="ui grid">
          <div class="sixteen wide mobile eleven wide tablet eleven wide computer column">
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
              <editor @on-created="onEditorCreated" id="commentEditor" data-mode="comment"></editor>
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
  .comment-form .comment-editor .ql-toolbar,
  .comment-form .comment-editor .ql-container {
    border: none;
  }

  .comment-form .comment-editor .ql-tooltip {
    z-index: 2;
  }
</style>

<script src="./topic_view.js"></script>
