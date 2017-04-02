<template>
  <div id="phoneSidenav" class="ui left inverted blue vertical accordion menu sidebar">
    <search-input v-model="searchKeyword" @on-enter="onSearchEnter" class="ui search item"></search-input>
    <router-link active-class="active" to="/home" class="item">{{$t('common.home')}}</router-link>
    <router-link active-class="active" to="/board/free" class="item">{{$t('board')}}</router-link>
    <router-link active-class="active" to="/gallery" class="item">{{$t('gallery')}}</router-link>
    <a active-class="active" class="item">{{$t('stats')}}</a>
    <a active-class="active" class="item">{{$t('jakdu.write')}}</a>
    <div class="item">
      <a class="title">
        <i class="dropdown icon"></i>
        <i class="globe icon"></i> {{$t('common.language')}}
      </a>
      <div class="content">
        <a :href="path + 'lang=ko'" class="item"><i class="kr flag"></i> {{$t('common.language.korean')}}</a>
        <a :href="path + 'lang=en'" class="item"><i class="us flag"></i> {{$t('common.language.english')}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import SearchInput from '../search_input/search_input.vue';

  export default {
    data() {
      return {
        path: window.location.pathname,
        searchKeyword: ''
      };
    },
    mounted() {
      const $el = $(this.$el);
      $el.accordion();

      $el.sidebar({
        onHide() {
          $('html').removeClass('ios');
        },
        onVisible() {
          $('html').addClass('ios');
        }
      }).sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events', '#phoneSidenav a.item');
    },
    watch: {
      $route(to, from) {
        const langQueryRegexp = /lang=(.[^&]+)/g;

        if (to.fullPath.match(langQueryRegexp)) {
          this.path = to.fullPath.replace(langQueryRegexp, () => '');
        } else {
          this.path = `${to.fullPath}${to.fullPath.lastIndexOf('?') !== -1 ? '&' : '?'}`;
        }

        if (to.path === '/search') {
          this.searchKeyword = to.query.q;
        }
      }
    },
    methods: {
      changeLocale(locale) {
        const langQueryRegexp = /lang=(.[^&]+)/g;
        if (window.location.href.match(langQueryRegexp)) {
          return window.location.href.replace(langQueryRegexp, () => `lang=${locale}`);
        } else {
          return `${window.location.href}?lang=${locale}`;
        }
      },
      onSearchEnter(keyword) {
        this.$router.push({
          name: 'search',
          query: {
            q: keyword,
            w: 'PO;CO;GA',
            from: 0,
            size: 3
          }
        });

        $(this.$el).sidebar('toggle');
      }
    },
    components: {
      'search-input': SearchInput
    }
  };

</script>
