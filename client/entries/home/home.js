import Vue from 'vue';
import Swiper from 'swiper';
import _extend from 'lodash/fp/extend';
import _reduce from 'lodash/fp/reduce';
import './home.css';
import '../../components/sidenav/sidenav';

const _assign = _extend.convert({
  'immutable': false
});

const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];

module.exports = Vue.component('home', {
  template: require('./home.html'),
  data () {
    return {
      posts: [],
      galleries: [],
      comments: [],
      users: [],
      homeDescription: {},
      popularSearchWords: [],
      encyclopedia: {}
    };
  },
  beforeRouteEnter (to, from, next) {
    $.when(
      $.ajax('/api/home/latest'),
      $.ajax('/api/search/popular/words?size=10'),
      $.ajax('/api/home/encyclopedia')
    ).done((latest, popularSearchWords, encyclopedia) => {
      latest[0].homeDescription.desc = _reduce((list, a) => {
        list.push(a.outerHTML);
        return list;
      })([], $(latest[0].homeDescription.desc).find('a'));

      next(vm => {
        _assign(vm, latest[0]);
        vm.popularSearchWords = popularSearchWords[0].popularSearchWords;
        vm.encyclopedia = encyclopedia[0];
      });
    });
  },
  watch: {
    galleries () {
      Vue.nextTick(() => {
        const $swiperContainer = $('.swiper-container');
        new Swiper($swiperContainer[0], {
          autoplay: true,
          autoplayDisableOnInteraction: false,
          loop: true,
          setWrapperSize: true,
          preloadImages: false,
          lazyLoading: true,
          lazyLoadingInPrevNext: true
        });
      });
    },
    posts () {
      Vue.nextTick(() => $('.ui.sticky').sticky('refresh', true));
    }
  },
  methods: {
    indexedColor (index) {
      return `${COLORS[index % COLORS.length]}`;
    },
    search (val) {
      return `/search?w=PO;CO;GA&q=${encodeURIComponent(val)}`;
    },
  },
  computed: {
    encyclopediaContent () {
      const content = this.encyclopedia.content || '';
      return `${content.slice(0, 50)}...`;
    }
  }
});
