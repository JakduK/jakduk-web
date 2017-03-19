<template>
  <div>
    <form class="ui icon input" @submit.prevent="search()">
      <input type="text" v-model="keyword" :placeholder="$t('search.placeholder.words')" autocomplete="off">
      <i class="search link icon"></i>
    </form>
    <div class="results"></div>
  </div>
</template>

<script>
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

</script>
