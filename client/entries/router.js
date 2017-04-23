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

const Gallery = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/gallery/gallery.vue'));
  }, 'gallery');
};

const GalleryView = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/gallery_view/gallery_view.vue'));
  }, 'gallery_view');
};

const Jakdu = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/jakdu/jakdu.vue'));
  }, 'jakdu');
};

const About = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/about/about.vue'));
  }, 'about');
};

const Stats = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/stats/stats.vue'));
  }, 'stats');
};

const StatsAttendances = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/stats/attendances.vue'));
  }, 'stats_attendances');
};

const StatsSupporters = resolve => {
  require.ensure([], require => {
    resolve(require('../entries/stats/supporters.vue'));
  }, 'stats_supporters');
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
    name: 'gallery',
    path: '/gallery',
    component: Gallery
  }, {
    name: 'gallery.view',
    path: '/gallery/:id',
    component: GalleryView
  }, {
    name: 'stats',
    path: '/stats',
    component: Stats,
    children: [{
      name: 'stats.supporters',
      path: 'supporters',
      component: StatsSupporters
    }, {
      name: 'stats.attendances',
      path: 'attendance/:category?',
      component: StatsAttendances
    }]
  }, {
    name: 'jakdu',
    path: '/jakdu',
    component: Jakdu
  }, {
    name: 'about',
    path: '/about',
    component: About
  }, {
    path: '*',
    component: NotFound
  }]
});
