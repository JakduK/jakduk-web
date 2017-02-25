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

export default {
  mode: 'history',
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    redirect: 'home',
    component: {
      template: require('./with_sidenav.html')
    },
    children: [{
      path: 'home',
      component: Home
    }, {
      path: 'board',
      component: Board
    }]
  }]
};
