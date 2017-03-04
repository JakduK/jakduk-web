import Vue from 'vue';
import $ from 'jquery';
import '../../components/pagination/pagination';
import '../../components/pager/pager';

const PAGE_SIZE = 10;
const PAGINATION_SHIFT_SIZE = 5;

function fetch(options) {
  return $.when(
    $.getJSON('/api/board/free/posts', {
      page: options.page,
      size: options.size,
      category: options.category
    }).then(data => data, (jXhr, result) => result),
    $.getJSON('/api/board/free/tops').then(data => data, (jXhr, result) => result)
  ).always((posts, tops) => {
    this.top = (tops === 'error' || !tops) ? undefined : tops;
    this.board = (posts === 'error' || !posts) ? undefined : posts;

    if (this.board) {
      const start = Math.floor(posts.number / PAGINATION_SHIFT_SIZE) * PAGINATION_SHIFT_SIZE + 1;
      const end = Math.min(posts.totalPages + 1, start + PAGINATION_SHIFT_SIZE);

      this.pagination.start = start;
      this.pagination.end = end;
      this.pagination.first = posts.first;
      this.pagination.last = posts.last;
      this.pagination.current = posts.number + 1;
      this.pagination.items = [];

      for (let i = start; i < end; i++) {
        this.pagination.items.push({
          label: i,
          page: i
        });
      }

      this.categories = ['ALL'];
      Object.keys(this.board.categories).forEach(key => {
        if (key !== 'ALL') {
          this.categories.push(key);
        }
      });
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
      categories: [],
      board: {
        categories: {},
        first: undefined,
        last: undefined,
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
      },
      category: undefined
    };
  },
  created() {
    this.$store.commit('load', true);
  },
  beforeRouteEnter(to, from, next) {
    next(_this => {
      const category = (to.query.category || 'ALL').toUpperCase();

      _this.category = category;

      fetch.call(_this, {
        page: Math.max(1, parseInt(to.query.page) || 1),
        size: PAGE_SIZE,
        category: category
      }).then(() => {
        $(_this.$el).find('#categories').dropdown({
          onChange(category) {
            _this.$router.push({
              path: 'board',
              query: {
                category: category
              }
            });
          }
        }).dropdown('set selected', category);
      });
    });
  },
  watch: {
    $route(to, from) {
      const category = (to.query.category || 'ALL').toUpperCase();

      this.category = category;

      fetch.call(this, {
        page: Math.max(1, parseInt(to.query.page) || 1),
        size: PAGE_SIZE,
        category: category
      });
    }
  },
  methods: {
    categoryLabel(category) {
      switch (category) {
        case 'FREE':
          return 'board.category.free';
        case 'FOOTBALL':
          return 'board.category.football';
        default:
          return 'board.category.all';
      }
    },
    categoryColor(category) {
      switch (category) {
        case 'FREE':
          return 'green';
        case 'FOOTBALL':
          return 'orange';
        default:
          return 'grey';
      }
    },
    categoryIcon(category) {
      switch (category) {
        case 'FREE':
          return 'newspaper';
        case 'FOOTBALL':
          return 'soccer';
        default:
          return 'unordered list';
      }
    },
    onPageChange(what) {
      let pageNumber = Math.max(1, parseInt(this.$route.query.page) || 1);

      switch (what) {
        case 'prev':
          pageNumber--;
          break;
        case 'next':
          pageNumber++;
          break;
        case 'unshift':
          pageNumber -= PAGINATION_SHIFT_SIZE;
          break;
        case 'shift':
          pageNumber += PAGINATION_SHIFT_SIZE;
          break;
        default:
          pageNumber = what;
          break;
      }

      pageNumber = Math.max(1, Math.min(pageNumber, this.board.totalPages));

      this.$router.push({
        path: 'board',
        query: {
          page: pageNumber,
          category: this.$route.query.category
        }
      });
    }
  }
});
