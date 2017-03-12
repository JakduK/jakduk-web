export default {
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
};
