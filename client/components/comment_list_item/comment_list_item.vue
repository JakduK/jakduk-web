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
        <span class="date">{{item.id | IdToRegDate('LL')}}</span>&middot;
        <div class="rating">
          <button @click="likeComment(item)">
            <i :style="{'font-weight': item.myFeeling === 'LIKE' ? 'bold' : 'normal'}" class="smile blue icon"></i>
            {{item.numberOfLike || 0}}
          </button> &nbsp;
          <button @click="dislikeComment(item)">
            <i :class="{'font-weight': item.myFeeling === 'DISLIKE' ? 'bold' : 'normal'}" class="meh teal icon"></i> {{item.numberOfDislike || 0}}
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
