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
        <div class="ui segment">
          <select id="categories" class="ui dropdown">
            <option v-for="id in categories" :value="id">
              <i :class="[categoryColor(id), categoryIcon(id)]" class="icon"></i> {{$t(categoryLabel(id))}}
            </option>
          </select>
          <router-link :to="{name: 'board.write', params: {name: $route.params.name}}" class="ui right floated icon button"><i class="write icon"></i></router-link>
        </div>

        <!--공지/게시글-->
        <div class="ui blue segment">
          <div class="ui selection divided list board">
            <board-list-item :is-notice="true" :item="notice" v-for="notice in board.notices" :key="notice.seq"></board-list-item>
            <board-list-item :is-notice="false" :item="post" v-for="post in board.posts" :key="post.seq"></board-list-item>
          </div>
        </div>
      </div>
      <div v-else class="ui segment">{{$t('failed.loading')}}</div>

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
  .board .ui.label {
    padding: 0.2em 0.4em;
  }

  .board .thumbnail {
    display: block;
    width: 95px;
    margin: 0 auto 5px;
  }

  .ui.list.notice {
    margin-bottom: 0.5em;
  }

  .ui.list.notice + .ui.list {
    margin-top: 0;
  }

  .ui.list.notice .item {
    padding-top: 0.3em !important;
    padding-bottom: 0.3em !important;
  }
</style>

<script>
  import $ from 'jquery';
  import BoardListItem from '../../components/board_list_item/board_list_item.vue';
  import Pagination from '../../components/pagination/pagination.vue';
  import Pager from '../../components/pager/pager.vue';
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
