import Vue from 'vue';
import Swiper from 'swiper';
import './home.css';
import '../../components/sidenav/sidenav';

const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];

function reduce() {
  return Array.prototype.reduce.call(arguments[0], arguments[1], arguments[2]);
}

module.exports = Vue.component('home', {
  template: require('./home.html'),
  data() {
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
  beforeRouteEnter(to, from, next) {
    $.when(
      $.ajax('/api/home/latest'),
      $.ajax('/api/search/popular/words?size=10'),
      $.ajax('/api/home/encyclopedia')
    ).done((latest, popularSearchWords, encyclopedia) => {
      latest[0].homeDescription.desc = reduce($(latest[0].homeDescription.desc).find('a'), (list, elem) => {
        list.push(elem.outerHTML);
        return list;
      }, []);

      next(vm => {
        $.extend(vm, latest[0]);
        vm.popularSearchWords = popularSearchWords[0].popularSearchWords;
        vm.encyclopedia = encyclopedia[0];
      });
    });
  },
  watch: {
    galleries() {
      Vue.nextTick(() => {
        const $swiperContainer = $('.swiper-container');

        /* eslint-disable no-new */
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
    posts() {
      Vue.nextTick(() => $('.ui.sticky').sticky('refresh', true));
    }
  },
  methods: {
    indexedColor(index) {
      return `${COLORS[index % COLORS.length]}`;
    },
    search(val) {
      return `/search?w=PO;CO;GA&q=${encodeURIComponent(val)}`;
    }
  },
  computed: {
    encyclopediaContent() {
      const content = this.encyclopedia.content || '';
      return `${content.slice(0, 50)}...`;
    }
  }
});
