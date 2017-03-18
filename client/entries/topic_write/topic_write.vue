<template>
  <div class="ui segments">
    <div class="ui segment">
      <div class="ui labled fluid input">
        <select id="categories" class="ui compact selection dropdown">
          <option v-for="category in categories" :value="category.code">
            <i :class="[categoryColor(category.code), categoryIcon(category.code)]" class="icon"></i> {{$t(categoryLabel(category.code))}}
          </option>
        </select>
        <input v-model="subject" type="text">
      </div>
      <div class="ui divider"></div>
      <editor @on-created="onEditorCreated" @on-image-uploaded="onImageUploaded" :data="{}" :options="{language: $store.state.locale, resize: true, statusbar: true}" data-mode="editor"></editor>
      <div class="ui divider"></div>
      <div class="clearfix">
        <button @click="submitPost" class="ui right floated blue labeled icon button">
          <i class="icon edit"></i> {{$t('common.post')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Editor from '../../components/editor/editor.vue';
  import CategoryColor from '../../filters/category_color';
  import CategoryIcon from '../../filters/category_icon';
  import CategoryLabel from '../../filters/category_label';

  export default {
    beforeRouteEnter(to, from, next) {
      $.getJSON('/api/board/free/categories').then(data => data, (response, result) => result).then(data => {
        next(_this => {
          _this.categories = data.categories;
          _this.$nextTick(() => {
            $(_this.$el).find('#categories').dropdown({
              onChange(category) {
                _this.category = category;
              }
            }).dropdown('set selected', 'FREE');
          });
        });
      });
    },
    data() {
      return {
        categories: [],
        category: 'FREE',
        subject: '',
        imageList: []
      }
    },
    methods: {
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      categoryIcon: CategoryIcon,
      onEditorCreated(editor) {
        editor.on('FullscreenStateChanged', event => {
          $('#main').css('z-index', event.state ? 99999 : '');
        });

        editor.on('ResizeEditor', () => {
          $('.ui.sticky').sticky('refresh', true);
        });
        $('.ui.sticky').sticky('refresh', true);

        this.editor = editor;

        this.$nextTick(() => {
          this.$store.commit('load', false);
        })
      },
      onImageUploaded(image) {
        this.imageList.push(image);
      },
      submitPost() {
        $.ajax({
          type: 'post',
          url: '/api/board/free',
          contentType: 'application/json',
          data: JSON.stringify({
            categoryCode: this.category,
            subject: this.subject,
            content: this.editor.getContent(),
            galleries: this.imageList
          })
        }).then(data => {
          this.$router.replace({
            name: 'board.view',
            params: {
              seq: data.seq
            }
          });
        });
      }
    },
    components: {
      editor: Editor
    }
  };
</script>
