import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/home/home.vue'));
  }, 'home');
};

const Board = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/board/board.vue'));
  }, 'board');
};

const TopicView = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/topic_view/topic_view.vue'));
  }, 'topic_view');
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
    path: '/home',
    component: Home
  }, {
    path: '/board',
    component: Board
  }, {
    path: '/board/topic/write',
    component: {
      template: '<p>{{$route}}</p>'
    }
  }, {
    path: '/board/topic/:seq',
    component: TopicView
  }]
});
