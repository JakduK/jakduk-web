import Vue from 'vue';
import $ from 'jquery';
import IdToRegDate from '../../filters/id_to_regdate';
import CategoryColor from '../../filters/category_color';
import CategoryIcon from '../../filters/category_icon';
import CategoryLabel from '../../filters/category_label';
import ErrorDialog from '../../utils/dialog_response_error';

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
    $.extend(post.post, {
      numberOfLike: (post.post.usersLiking || []).length,
      numberOfDislike: (post.post.usersDisliking || []).length
    });
    $.extend(this, post);
  }

  if (comments) {
    if (comments.comments && comments.comments.length) {
      comments.comments = comments.comments.map(comment => {
        comment.numberOfLike = (comment.usersLiking || []).length;
        comment.numberOfDislike = (comment.usersDisliking || []).length;
        return comment;
      });
    }

    this.comments = comments.comments;
    this.commentCount = comments.commentCount;
  }
}

export default Vue.component('topic-view', {
  template: require('./topic_view.html'),
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
    likeOrDislike(what) {
      $.post(`/api/board/free/${this.post.seq}/${what}`).then(data => {
        this.post.myFeeling = data.myFeeling;
        this.post.numberOfLike = data.numberOfLike;
        this.post.numberOfDislike = data.numberOfDislike;
      }, ErrorDialog);
    },
    likeOrDislikeComment(comment, what) {
      $.post(`/api/board/free/comment/${comment.id}/${what}`).then(data => {
        comment.myFeeling = data.myFeeling;
        comment.numberOfLike = data.numberOfLike;
        comment.numberOfDislike = data.numberOfDislike;
      }, ErrorDialog);
    }
  }
});
