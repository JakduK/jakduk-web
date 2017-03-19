<template>
  <div class="ui segments">
    <div class="ui segment">
      <div class="ui labeled fluid input">
        <select id="categories" class="ui label compact selection dropdown">
          <option v-for="category in categories" :value="category.code">
            <i :class="[categoryColor(category.code), categoryIcon(category.code)]" class="icon"></i> {{$t(categoryLabel(category.code))}}
          </option>
        </select>
        <input v-model="subject" id="subject" type="text" autofocus>
      </div>
      <div class="ui divider"></div>
      <editor @on-created="onEditorCreated" @on-image-uploaded="onImageUploaded" :data="{imageList: imageList}" :options="{language: $store.state.locale, resize: true, statusbar: true}" data-mode="editor"></editor>
      <div class="ui divider"></div>
      <div class="clearfix">
        <button @click="checkForm(editor) && submitPost()" :class="{loading: isSubmitting}" class="ui right floated blue labeled icon button">
          <i class="icon edit"></i> {{$t('common.post')}}
        </button>
        <button @click="$router.go(-1)" class="ui right floated blue labeled icon button">
          <i class="icon chevron left"></i> {{$t('common.back')}}
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
  import EditorValidator from '../../utils/editor_validator';

  export default {
    data() {
      return {
        categories: [],
        category: 'FREE',
        subject: '',
        imageList: [],
        isSubmitting: false
      }
    },
    created() {
      this.$store.commit('load', true);

      this.defers = {
        editor: $.Deferred(),
        data: $.Deferred()
      };

      $.when(this.defers.editor, this.defers.data).then(() => {
        if (this.editMode) {
          $(this.$el).find('#categories').dropdown('set selected', this.post.category.code);
          this.subject = this.post.subject;
          this.imageList = this.post.galleries;
          this.editor.setContent(this.post.content);
        }

        this.$store.commit('load', false);
      });
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

        this.defers.editor.resolve();
      },
      onImageUploaded(image) {
        this.imageList.push(image);
      },
      checkForm() {
        if (!this.$store.state.isAuthenticated) {
          if (window.confirm(this.$t('common.do.you.want.to.login'))) {
            window.location = `/login?redir=${encodeURIComponent(this.$route.fullPath)}`;
          }
          return false;
        }

        if (this.isSubmitting) {
          return false;
        }

        if (this.subject.length < 3) {
          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t('Size.boardFreeWrite.subject')
          });
          $(this.$el).find('#subject').focus();
          return false;
        }

        if (!EditorValidator(this.editor, {min: 5, max: Infinity})) {
          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t('Size.boardFreeWrite.content')
          });
          this.editor.focus();
          return false;
        }

        return true;
      },
      submitPost() {
        this.isSubmitting = true;

        $.ajax({
          type: this.editMode ? 'put' : 'post',
          url: `/api/board/free/${this.editMode ? this.post.seq : ''}`,
          contentType: 'application/json',
          data: JSON.stringify({
            categoryCode: this.category,
            subject: this.subject,
            content: this.editor.getContent(),
            galleries: this.imageList.map(image => {
              const img = this.editor.getDoc().querySelector(`[data-mce-src="${image.imageUrl}"]`);
              return {
                id: image.id,
                fileName: image.fileName,
                size: image.size,
                name: img.getAttribute('title') || image.fileName || image.name
              };
            })
          })
        }).then(data => {
          this.$router.replace({
            name: 'board.view',
            params: {
              seq: data.seq
            }
          });
        }, ...response => {
          this.$store.dispatch('globalMessage', {
            level: 'error',
            message: response[2]
          });
          this.isSubmitting = false;
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      const editMode = to.meta.mode === 'edit';
      let promises = [$.getJSON('/api/board/free/categories').then(data => data, (response, result) => result)];

      if (editMode) {
        promises.push($.getJSON(`/api/board/free/${to.params.seq}`).then(data => data, (response, result) => result));
      }

      $.when.apply(null, promises).then((categories, post) => {
        next(_this => {
          if (editMode) {
            if (!_this.$store.state.myProfile || _this.$store.state.myProfile.id !== post.post.writer.userId) {
              window.alert(_this.$t('common.msg.error.401'));
              _this.$router.go(-1);
              return;
            }
          }

          if (post) {
            _this.post = post.post;
          }

          _this.editMode = editMode;
          _this.categories = categories.categories;

          _this.$nextTick(() => {
            $(_this.$el).find('#categories').dropdown({
              onChange(category) {
                _this.category = category;
              }
            }).dropdown('set selected', 'FREE');

            _this.defers.data.resolve();
          });
        });
      });
    },
    components: {
      editor: Editor
    }
  };
</script>
