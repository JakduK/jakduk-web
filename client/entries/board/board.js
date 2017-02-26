import Vue from 'vue';
import $ from 'jquery';

function fetch(options) {
  $.when(
    $.getJSON('/api/board/free/posts', {
      page: options.page,
      size: options.size,
      category: options.category
    }).then(data => data, (jXhr, result) => result),
    $.getJSON('/api/board/free/tops').then(data => data, (jXhr, result) => result)
  ).always((posts, tops) => {
    this.top = tops === 'error' ? undefined : tops;
    this.board = posts === 'error' ? undefined : posts;
    this.$store.commit('load', false);

    this.$nextTick(() => {
      $('.ui.sticky').sticky('refresh', true);
    });
  });
}

export default Vue.component('board', {
  template: require('./board.html'),
  data() {
    return {
      board: {
        categories: {},
        first: true,
        last: true,
        notices: [],
        number: 0,
        numberOfElements: 0,
        posts: [],
        size: 0,
        totalElements: 0,
        totalPages: 0
      },
      top: {
        topLikes: [],
        topComments: []
      }
    };
  },
  created() {
    this.$store.commit('load', true);
  },
  beforeRouteEnter(to, from, next) {
    next(_this => {
      fetch.call(_this, {
        page: 1,
        size: 12,
        category: 'ALL'
      });
    });
  },
  watch: {
    $route(to, from) {
      fetch.call(this, {
        page: to.query.page || 1,
        size: to.query.size || 12,
        category: to.query.category || 'ALL'
      });
    }
  },
  methods: {
    categoryText(category) {
      switch (category) {
        case 'FOOTBALL':
          return 'board.category.football';
        case 'FREE':
          return 'board.category.free';
        default:
          return '';
      }
    },
    categoryLabelColor(category) {
      switch (category) {
        case 'FOOTBALL':
          return 'blue';
        default:
          return 'green';
      }
    }
  }
});
