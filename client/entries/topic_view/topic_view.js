import Vue from 'vue';
import $ from 'jquery';
import IdToRegDate from '../../filters/id_to_regdate';
import CategoryColor from '../../filters/category_color';
import CategoryIcon from '../../filters/category_icon';
import CategoryLabel from '../../filters/category_label';

function fetch(seq) {
  return $.when(
    $.getJSON(`/api/board/free/${seq}`).then(data => data, (jXhr, result) => result),
    $.getJSON(`/api/board/free/${seq}/comments`).then(data => data, (jXhr, result) => result)
  );
}

export default Vue.component('topic-view', {
  template: require('./topic_view.html'),
  data() {
    return {
      post: {
        id: '',
        category: {},
        writer: {},
        usersLiking: [],
        usersDisliking: []
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
      next(_this => {
        $.extend(_this, post);
        _this.comments = comments.comments;
        _this.commentCount = comments.commentCount;
        _this.$store.commit('load', false);
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    fetch(to.params.seq).then((post, comments) => {
      $.extend(this, post);
      this.comments = comments.comments;
      this.commentCount = comments.commentCount;

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
    like() {},
    dislike() {},
    likeComment(comment) {
      console.log(comment);
    },
    dislikeComment(comment) {
      console.log(comment);
    }
  },
  computed: {
    likeCount() {
      return (this.post.usersLiking || []).length;
    },
    dislikeCount() {
      return (this.post.usersDisliking || []).length;
    }
  }
});
