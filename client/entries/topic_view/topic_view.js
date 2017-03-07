import Vue from 'vue';
import $ from 'jquery';
import PostRegdate from '../../filters/post_regdate';
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
        writer: {}
      },
      latestPostsByWriter: [],
      nextPost: {},
      prevPost: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    next(_this => {
      $.getJSON(`/api/board/free/${_this.$route.params.seq}`).then(data => data, (jXhr, result) => result).then(data => {
        $.extend(_this, data);
        _this.$store.commit('load', false);
        _this.$nextTick(() => {
          $('.ui.sticky').sticky('refresh', true);
        });
      });
    });
  },
  filters: {
    postRegDate: PostRegdate
  },
  methods: {
    categoryColor: CategoryColor,
    categoryLabel: CategoryLabel,
    categoryIcon: CategoryIcon
  }
});
