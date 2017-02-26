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
  routes: [{
    path: '/',
    redirect: 'home',
    component: {
      template: require('./with_sidenav.html'),
      computed: {
        loading() {
          return this.$store.state.loading;
        }
      }
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
