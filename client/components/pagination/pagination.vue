<template>
  <div>
    <div class="ui pagination icon borderless tiny menu">
      <a @click="unshift()" class="item"><i class="left angle double icon"></i></a>
      <a v-for="item in pagination.items" :class="{active: item.page === pagination.current, disabled: item.page === undefined}" @click="change(item.page)" class="item">{{item.label}}</a>
      <a @click="shift()" class="item"><i class="right angle double icon"></i></a>
    </div>
  </div>
</template>

<style scoped>
  .ui.pagination.menu .item.active {
    font-weight: bold;
  }
</style>

<script src="./pagination.js"></script>
