<template>
  <div @click="click" class="ui floating icon small message cursor-pointer">
    <i :class="levelStyle" class="icon"></i>
    <div class="content">
      <div v-if="title" class="header">{{title}}</div>
      <p v-if="message">{{message}}</p>
    </div>
  </div>
</template>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
</style>

<script>
  export default {
    props: {
      level: '',
      title: '',
      message: ''
    },
    computed: {
      levelStyle() {
        switch (this.level) {
          case 'warn':
            return 'info circle yellow';
          case 'error':
            return 'info circle red';
          default:
            return 'info circle blue';
        }
      }
    },
    methods: {
      click() {
        this.$emit('on-click');
      }
    }
  };
</script>
