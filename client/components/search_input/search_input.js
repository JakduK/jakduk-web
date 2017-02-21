import Vue from 'vue';

Vue.component('search-input', {
  template: require('./search_input.html'),
  data() {
    return {
      keyword: ''
    };
  },
  methods: {
    search() {
      window.location = `/search?w=PO;CO;GA&q=${encodeURIComponent(this.keyword)}`;
    }
  }
});
