import Vue from 'vue';

export default Vue.component('search-input', {
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
