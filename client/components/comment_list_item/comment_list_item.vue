<template>
  <div class="comment">
    <a class="avatar">
      <img :src="avatarSrc(item.writer.picture)">
    </a>
    <div v-if="isAuthenticated && myProfile.id === item.writer.userId" class="pull-right">
      <button @click="deleteComment(item)" class="ui icon mini basic button"><i class="remove blue fitted icon"></i></button>
    </div>
    <div class="content ql-snow">
      <a class="author">{{item.writer.username}}</a>
      <div class="metadata">
        <span class="date">{{item.id | IdToRegDate('LL')}}</span>
        <div class="rating">
          <button @click="likeComment(item)" :class="item.myFeeling === 'LIKE' ? 'blue' : 'basic'" class="ui label nomargin mini">
            <i :class="{blue: item.myFeeling !== 'LIKE'}" class="smile icon"></i>
            {{item.numberOfLike || 0}}
          </button>
          <button @click="dislikeComment(item)" :class="item.myFeeling === 'DISLIKE' ? 'teal' : 'basic'" class="ui label nomargin mini">
            <i :class="{teal: item.myFeeling !== 'DISLIKE'}" class="meh icon"></i> {{item.numberOfDislike || 0}}
          </button>
        </div>
      </div>
      <div class="text ql-editor" v-html="item.content"></div>
      <!--
      추후 댓글답변
      <div class="actions">
        <a class="reply">Reply</a>
      </div>
      -->
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import IdToRegDate from '../../filters/id_to_regdate';

  export default {
    props: ['item'],
    computed: mapState(['isAuthenticated', 'myProfile']),
    methods: {
      deleteComment(comment) {
        this.$emit('on-delete', comment);
      },
      likeComment(comment) {
        this.$emit('on-like', comment);
      },
      dislikeComment(comment) {
        this.$emit('on-dislike', comment);
      },
    },
    filters: {
      IdToRegDate: IdToRegDate
    }
  };
</script>
