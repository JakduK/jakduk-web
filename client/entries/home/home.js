import Vue from 'vue';
import Swiper from 'swiper';
import '../../components/sidenav/sidenav';
import truncate from 'lodash/fp/truncate';

const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];

function reduce() {
  return Array.prototype.reduce.call(arguments[0], arguments[1], arguments[2]);
}

function fetch() {
  const promises = $.when(
    $.ajax('/api/home/latest').then(data => data, (jXhr, result) => result),
    $.ajax('/api/search/popular/words?size=10').then(data => data, (jXhr, result) => result),
    $.ajax('/api/home/encyclopedia').then(data => data, (jXhr, result) => result)
  );

  promises.always((latest, popularSearchWords, encyclopedia) => {
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
    this.isReady = true;

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

      $('.ui.sticky').sticky('refresh', true);

      this.$store.commit('loaded');
    });
  });
}

export default Vue.component('home', {
  template: require('./home.html'),
  data() {
    return {
      posts: [],
      galleries: [],
      comments: [],
      users: [],
      homeDescription: {},
      popularSearchWords: [],
      encyclopedia: {},
      isReady: false
    };
  },
  beforeRouteEnter(to, from, next) {
    next(_this => {
      fetch.call(_this);
    });
  },
  methods: {
    indexedColor(index) {
      return `${COLORS[index % COLORS.length]}`;
    },
    searchQuery(val) {
      return `/search?w=PO;CO;GA&q=${encodeURIComponent(val)}`;
    }
  },
  computed: {
    encyclopediaSummary() {
      return `${truncate(50)(this.encyclopedia.content)}`;
    }
  }
});
