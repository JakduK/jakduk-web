<template>
  <div class="ui segment">
    <editor @on-created="onEditorCreated" data-mode="editor"></editor>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Editor from '../../components/editor/editor.vue';

  export default {
    mounted() {

    },
    updated() {

    },
    methods: {
      onEditorCreated(editor) {
        this.commentEditor = editor;
        this.$store.commit('load', false);
        $('.ui.sticky').sticky('refresh', true);
      }
    },
    components: {
      editor: Editor
    }
  };
</script>
