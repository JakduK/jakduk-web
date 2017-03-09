import Vue from 'vue';
import $ from 'jquery';
import Swiper from 'swiper';
import Truncate from 'lodash/fp/truncate';
import '../../components/sidenav/sidenav';
import IdToRegDate from '../../filters/id_to_regdate';

const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];

function reduce() {
  return Array.prototype.reduce.call(arguments[0], arguments[1], arguments[2]);
}

function fetch() {
  const promises = $.when(
    $.getJSON('/api/home/latest').then(data => data, (jXhr, result) => result),
    $.getJSON('/api/search/popular/words?size=10').then(data => data, (jXhr, result) => result),
    $.getJSON('/api/home/encyclopedia').then(data => data, (jXhr, result) => result)
  );

  promises.always((latest, popularSearchWords, encyclopedia) => {
    if (latest !== 'error') {
      let $news = $(`<div>${latest.homeDescription.desc}</div>`).find('>ul').children();
      latest.homeDescription.desc = reduce($news, (list, elem) => {
        list.push(elem.innerHTML);
        return list;
      }, []);
    }

    this.latest = latest === 'error' ? undefined : latest;
    this.popularSearchWords = popularSearchWords === 'error' ? undefined : popularSearchWords.popularSearchWords;
    this.encyclopedia = encyclopedia === 'error' ? undefined : encyclopedia;
    this.$store.commit('load', false);

    this.$nextTick(() => {
      $('.swiper-container').each((index, element) => {
        /* eslint-disable no-new */
        new Swiper(element, {
          autoplay: true,
          autoplayDisableOnInteraction: false,
          loop: true,
          setWrapperSize: true,
          preloadImages: false,
          lazyLoading: true,
          lazyLoadingInPrevNext: true
        });
      });
    });
  });
}

export default Vue.component('home', {
  template: require('./home.html'),
  filters: {
    IdToRegDate: IdToRegDate
  },
  data() {
    return {
      latest: {
        posts: [],
        comments: [],
        galleries: [],
        users: [],
        homeDescription: {}
      },
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
  created() {
    this.$store.commit('load', true);
  },
  updated() {
    $('.ui.sticky').sticky('refresh', true);
  },
  methods: {
    indexedColor(index, random) {
      return `${COLORS[(random ? (Math.random() * 10).toFixed() % COLORS.length : index) % COLORS.length]}`;
    },
    searchQuery(val) {
      return `/search?w=PO;CO;GA&q=${encodeURIComponent(val)}`;
    }
  },
  computed: {
    encyclopediaSummary() {
      return `${Truncate(50)(this.encyclopedia.content)}`;
    }
  }
});
