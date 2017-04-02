import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/home/home.vue'));
  }, 'home');
};

const Board = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/board/board.vue'));
  }, 'board');
};

const TopicView = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/topic_view/topic_view.vue'));
  }, 'topic_view');
};

const TopicWrite = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/topic_write/topic_write.vue'));
  }, 'topic_write');
};

const SearchView = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/search_view/search_view.vue'));
  }, 'search_view');
};

const NotFound = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/not_found/not_found.vue'));
  }, 'not_found');
};

export default new VueRouter({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    };
  },
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    name: 'home',
    path: '/home',
    component: Home
  }, {
    name: 'board',
    path: '/board/:name',
    component: Board
  }, {
    name: 'board.write',
    path: '/board/:name/write',
    meta: {
      requiresAuth: true
    },
    component: TopicWrite
  }, {
    name: 'board.view',
    path: '/board/:name/:seq',
    component: TopicView
  }, {
    name: 'board.edit',
    path: '/board/:name/:seq/edit',
    meta: {
      requiresAuth: true,
      mode: 'edit'
    },
    component: TopicWrite
  }, {
    name: 'search',
    path: '/search',
    component: SearchView
  }, {
    path: '*',
    component: NotFound
  }]
});
