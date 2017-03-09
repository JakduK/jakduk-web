import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Home = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/home/home'));
  }, 'home');
};

const Board = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/board/board'));
  }, 'board');
};

const TopicView = resolve => {
  require.ensure([], (require) => {
    resolve(require('../entries/topic_view/topic_view'));
  }, 'topic_view');
};

export default new VueRouter({
  mode: 'history',
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