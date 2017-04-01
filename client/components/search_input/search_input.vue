<template>
  <div>
    <form class="ui icon input" @submit.prevent="search()">
      <input ref="input" @input="updateValue($event.target.value)" :value="value" :placeholder="$t('search.placeholder.words')" type="text" autocomplete="off">
      <i class="search link icon"></i>
    </form>
    <div class="results"></div>
  </div>
</template>

<script>
  export default {
    props: ['value'],
    methods: {
      updateValue(value) {
        this.$emit('input', value);
      },
      search() {
        this.$emit('on-enter', this.value);
      }
    }
  };
</script>
