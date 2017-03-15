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
  computed: mapState(['isAuthenticated', 'myProfile']),
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
          window.location = `/login?redir=${encodeURIComponent(`${location.pathname}${location.search}`)}`;
        }
        return;
      }

      const commentText = this.commentEditor.getContent({format: 'text'}).trim();

      if (commentText.length < 3 || commentText.length > 800) {
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
