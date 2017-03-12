<template>
  <div>
    <button :class="{disabled: isFirst}" @click="prev" class="ui icon small button">
      <i class="left chevron icon"></i>
    </button>
    <button :class="{disabled: isLast}" @click="next" class="ui right icon small button">
      <i class="right chevron icon"></i>
    </button>
  </div>
</template>

<script src="./pager.js"></script>
