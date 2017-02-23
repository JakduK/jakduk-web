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
  created() {
    $.when(
      $.ajax('/api/home/latest').then(data => data, (jXhr, result) => result),
      $.ajax('/api/search/popular/words?size=10').then(data => data, (jXhr, result) => result),
      $.ajax('/api/home/encyclopedia').then(data => data, (jXhr, result) => result)
    ).always((latest, popularSearchWords, encyclopedia) => {
      if (latest === 'error') {
        this.homeDescription = {desc: [this.$t('failed.loading')]};
      } else {
        latest.homeDescription.desc = reduce($(latest.homeDescription.desc).find('a'), (list, elem) => {
          list.push(elem.outerHTML);
          return list;
        }, []);
        $.extend(this, latest);
      }

      this.popularSearchWords = popularSearchWords === 'error' ? undefined : popularSearchWords.popularSearchWords;
      this.encyclopedia = encyclopedia === 'error' ? undefined : encyclopedia;

      this.$nextTick(() => {
        this.$store.commit('loaded');
      });
    });
  },
  watch: {
    galleries() {
      this.$nextTick(() => {
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
      this.$nextTick(() => $('.ui.sticky').sticky('refresh', true));
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
