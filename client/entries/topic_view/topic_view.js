import Vue from 'vue';
import $ from 'jquery';
import IdToRegDate from '../../filters/id_to_regdate';
import CategoryColor from '../../filters/category_color';
import CategoryIcon from '../../filters/category_icon';
import CategoryLabel from '../../filters/category_label';

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
    $.when(
      $.getJSON(`/api/board/free/${to.params.seq}`).then(data => data, (jXhr, result) => result),
      $.getJSON(`/api/board/free/${to.params.seq}/comments`).then(data => data, (jXhr, result) => result)
    )
    .then((post, comments) => {
      next(_this => {
        $.extend(_this, post);
        _this.comments = comments.comments;
        _this.commentCount = comments.commentCount;
        _this.$store.commit('load', false);
        _this.$nextTick(() => {
          $('.ui.sticky').sticky('refresh', true);
        });
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    $.getJSON(`/api/board/free/${to.params.seq}`).then(data => data, (jXhr, result) => result).then(data => {
      $.extend(this, data);
      this.$store.commit('load', false);
      this.$nextTick(() => {
        $('.ui.sticky').sticky('refresh', true);
      });

      next();
    });
  },
  updated() {
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
