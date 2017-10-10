<template>
  <div class="ui tablet reversed computer reversed grid">
    <div class="sixteen wide mobile eleven wide tablet twelve wide computer column">
      <!--top네이게이션-->
      <div class="ui grid">
        <pagination :pagination="pagination" @on-change="onPageChange" class="sixteen wide mobile twelve wide tablet twelve wide computer column"></pagination>
        <pager :is-first="pagination.first" :is-last="pagination.last" @on-prev="onPageChange" @on-next="onPageChange" class="four wide tablet only four wide computer only right aligned column"></pager>
      </div>

      <div v-if="board" class="ui segments">
        <!--분류-->
        <div class="ui segment clearfix" :class="$route.params.name === 'free' ? 'no-categories' : ''">
          <select id="categories" class="ui dropdown">
            <option v-for="category in categories.list" :value="category.code" :key="category.code">
              <i v-if="category.icon" :class="[category.icon, category.color]"></i> {{category.name}}
            </option>
          </select>
          <router-link :to="{name: 'board.write', params: {name: $route.params.name}}" class="ui right floated icon button"><i class="write icon"></i></router-link>
        </div>

        <!--공지/게시글-->
        <div class="ui blue segment">
          <div class="ui divided items board">
            <board-list-item :is-notice="true" :item="notice" v-for="notice in board.notices" :key="notice.seq"></board-list-item>
            <board-list-item :is-notice="false" :item="post" :category="categories[post.category]" v-for="post in board.articles" :key="post.seq"></board-list-item>
          </div>
        </div>
      </div>
      <div v-else="" class="ui segment">{{$t('failed.loading')}}</div>

      <!--bottom네비게이션-->
      <div class="ui grid">
        <pagination :pagination="pagination" @on-change="onPageChange" class="eleven wide tablet computer only column"></pagination>
        <pager :is-first="pagination.first" :is-last="pagination.last" @on-prev="onPageChange" @on-next="onPageChange" class="sixteen wide mobile five wide tablet five wide computer right aligned column"></pager>
      </div>
    </div>

    <div class="sixteen wide mobile five wide tablet four wide computer column">
      <!--주간 좋아요 선두-->
      <div class="ui segments widget">
        <h5 class="ui segment"><i class="blue thumbs outline up icon"></i> {{$t('board.top.likes')}}</h5>
        <div class="ui blue segment">
          <div v-if="top" class="ui middle aligned selection relaxed small list">
            <router-link :to="{name: 'board.view', params: {seq: post.seq}, query: $route.query}" v-for="(post, index) in top.topLikes" :key="post.seq" v-tooltip :data-content="post.subject" class="item">
              <div class="header text-overflow">{{post.subject}}</div>
              <div class="extra">
                <i class="smile icon"></i>{{post.count}} &nbsp; <i class="eye icon"></i>{{post.views}}
              </div>
            </router-link>
            <p v-if="!top.topLikes.length">
              <i class="warning red icon"></i>{{$t('there.is.no.activity')}}
            </p>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>

      <!--주간 댓글 선두-->
      <div class="ui segments widget">
        <h5 class="ui segment"><i class="blue talk icon"></i> {{$t('board.top.comments')}}</h5>
        <div class="ui blue segment">
          <div v-if="top" class="ui middle aligned selection relaxed small list">
            <router-link :to="{name: 'board.view', params: {name: $route.params.name, seq: post.seq}, query: $route.query}" v-for="(post, index) in top.topComments" :key="post.seq" v-tooltip :data-content="post.subject" class="item">
              <div class="header text-overflow">{{post.subject}}</div>
              <div class="extra">
                <i class="talk outline icon"></i>{{post.count}} &nbsp; <i class="eye icon"></i>{{post.views}}
              </div>
            </router-link>
            <p v-if="!top.topComments.length">
              <i class="warning red icon"></i>{{$t('there.is.no.activity')}}
            </p>
          </div>
          <p v-else>{{$t('failed.loading')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .no-categories > .dropdown {
    display: none !important;
  }
</style>

<script>
  import $ from 'jquery';
  import BoardListItem from '../../components/board_list_item/board_list_item.vue';
  import Pagination from '../../components/pagination/pagination.vue';
  import Pager from '../../components/pager/pager.vue';
  import createCategoriesVM from '../../filters/categories_view_model';

  const PAGE_SIZE = 10;
  const PAGINATION_SHIFT_SIZE = 5;

  function fetch(options) {
    return $.when(
      $.getJSON(`/api/board/${options.boardName}/articles`, {
        page: options.page,
        size: options.size,
        categoryCode: options.category
      }).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/${options.boardName}/tops`).then(data => data, (response, result) => result),
      $.getJSON(`/api/board/${options.boardName}/categories?lang=${this.$lang.split('-')[0]}`).then(data => data, (response, result) => result)
    ).always((board, tops, boardCategories) => {
      this.top = (tops === 'error' || !tops) ? undefined : tops;
      this.board = (board === 'error' || !board) ? undefined : board;

      if (this.board) {
        const start = Math.floor(board.number / PAGINATION_SHIFT_SIZE) * PAGINATION_SHIFT_SIZE + 1;
        const end = Math.min(board.totalPages + 1, start + PAGINATION_SHIFT_SIZE);

        this.pagination.start = start;
        this.pagination.end = end;
        this.pagination.first = board.first;
        this.pagination.last = board.last;
        this.pagination.current = board.number + 1;
        this.pagination.items = [];

        for (let i = start; i < end; i++) {
          this.pagination.items.push({
            label: i,
            page: i
          });
        }

        this.categories = createCategoriesVM.call(this, boardCategories.categories, true);
      }

      this.$store.commit('load', false);
    });
  }

  export default {
    data() {
      return {
        categories: {
          list: []
        },
        board: {
          categories: {},
          first: undefined,
          last: undefined,
          notices: [],
          number: 0,
          numberOfElements: 0,
          articles: [],
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
    beforeRouteEnter(to, from, next) {
      next(_this => {
        const category = (to.query.category || 'ALL').toUpperCase();
        const boardName = to.params.name;

        _this.category = category;

        _this.setDocumentTitle(_this.$t('board.name.free'), _this.$t('common.jakduk'));

        fetch.call(_this, {
          page: Math.max(1, parseInt(to.query.page) || 1),
          size: PAGE_SIZE,
          category: category,
          boardName: boardName
        }).then(() => {
          $(_this.$el).find('#categories').dropdown({
            onChange(category) {
              _this.$router.push({
                name: 'board',
                params: _this.$route.params,
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
      const boardName = to.params.name;

      this.category = category;

      fetch.call(this, {
        page: Math.max(1, parseInt(to.query.page) || 1),
        size: PAGE_SIZE,
        category: category,
        boardName: boardName
      }).then(() => {
        next();
        $(this.$el).find('#categories').dropdown('set selected', category);
      });
    },
    updated() {
      $('.ui.sticky').sticky('refresh', true);
    },
    methods: {
      decorateCategory() {

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
          name: 'board',
          params: this.$route.params,
          query: {
            page: pageNumber,
            category: this.$route.query.category
          }
        });
      }
    },
    components: {
      'board-list-item': BoardListItem,
      pager: Pager,
      pagination: Pagination
    }
  };

</script>
