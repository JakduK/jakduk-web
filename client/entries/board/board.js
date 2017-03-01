import Vue from 'vue';
import $ from 'jquery';
import '../../components/pagination/pagination';

const PAGE_SIZE = 11;
const PAGINATION_SHIFT_SIZE = 5;

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
    if (this.board) {
      this.pagination.first = posts.first;
      this.pagination.last = posts.last;
      this.pagination.current = posts.number + 1;
      this.pagination.items = [];

      for (let i = Math.floor(this.pagination.current / PAGINATION_SHIFT_SIZE) * PAGINATION_SHIFT_SIZE; i < 5; i++) {
        this.pagination.items.push({
          label: i + 1,
          page: i + 1
        });
      }
    }
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
      },
      pagination: {
        current: 0,
        items: []
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
        size: PAGE_SIZE,
        category: 'ALL'
      });
    });
  },
  watch: {
    $route(to, from) {
      fetch.call(this, {
        page: to.query.page || 1,
        size: to.query.size || PAGE_SIZE,
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
          return 'violet';
        default:
          return 'green';
      }
    },
    onChangePage(index) {
      this.$router.push({
        path: 'board',
        query: {
          page: index
        }
      });
    }
  }
});
