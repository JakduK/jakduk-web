import $ from 'jquery';
import Pagination from '../../components/pagination/pagination.vue';
import Pager from '../../components/pager/pager.vue';
import IdToRegDate from '../../filters/id_to_regdate';
import CategoryColor from '../../filters/category_color';
import CategoryIcon from '../../filters/category_icon';
import CategoryLabel from '../../filters/category_label';

const PAGE_SIZE = 15;
const PAGINATION_SHIFT_SIZE = 5;

function fetch(options) {
  return $.when(
    $.getJSON('/api/board/free/posts', {
      page: options.page,
      size: options.size,
      category: options.category
    }).then(data => data, (response, result) => result),
    $.getJSON('/api/board/free/tops').then(data => data, (response, result) => result)
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
  });
}

export default {
  filters: {
    IdToRegDate: IdToRegDate
  },
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
  updated() {
    $('.ui.sticky').sticky('refresh', true);
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
              path: '/board',
              query: {
                category: category
              }
            });
          }
        }).dropdown('set selected', category);
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    const category = (to.query.category || 'ALL').toUpperCase();

    this.category = category;

    fetch.call(this, {
      page: Math.max(1, parseInt(to.query.page) || 1),
      size: PAGE_SIZE,
      category: category
    }).then(() => {
      next();
    });
  },
  methods: {
    categoryColor: CategoryColor,
    categoryLabel: CategoryLabel,
    categoryIcon: CategoryIcon,
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
        path: '/board',
        query: {
          page: pageNumber,
          category: this.$route.query.category
        }
      });
    },
    compose() {
      this.$router.push({
        path: '/board/topic/write',
        query: this.$route.query
      });
    }
  },
  components: {
    pager: Pager,
    pagination: Pagination
  }
};
