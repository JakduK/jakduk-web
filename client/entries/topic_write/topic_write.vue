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

      <div class="editor-container">
        <editor @on-created="onEditorCreated" @on-image-uploaded="onImageUploaded" :options="{mode: 'editor', language: $store.state.locale}"></editor>
      </div>

      <div v-if="imageList.length" class="ui divided items">
        <div v-for="image in imageList" :key="image.id" :data-image-id="image.id" class="item">
          <div class="ui small image">
            <img :src="image.imageUrl">
          </div>
          <div class="content">
            <div class="ui header tiny break-all">
              <div v-if="image.isRenaming" class="ui form">
                <div class="field">
                  <input v-model="image.newName" @keyup.enter.esc="enterNewImageName(image, $event)">
                </div>
              </div>
              <template v-else>{{image.name}}</template>
            </div>
            <div v-if="image.fileSize" class="meta">
              <span class="date">{{image.fileSize | fileSize}}</span>
            </div>
            <div class="extra">
              <div class="ui right floated basic buttons">
                <button @click="insertImage(image)" class="ui compact button">{{$t('common.insert.into.content')}}</button>
                <button @click="renameImage(image)" class="ui compact button">{{$t('common.rename')}}</button>
                <button @click="deleteImage(image)" class="ui icon compact button"><i class="icon blue remove"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <div class="clearfix">
        <button @click="checkForm(editor) && submitPost()" :class="{loading: isSubmitting}" class="ui right floated blue labeled icon button">
          <i class="icon edit"></i> {{$t(editMode ? 'common.save' : 'common.post')}}
        </button>
        <button @click="$router.go(-1)" class="ui right floated blue labeled icon button">
          <i class="icon chevron left"></i> {{$t('common.back')}}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
  .editor-container {
    height: 640px;
  }
</style>

<script>
  import $ from 'jquery';
  import CategoryColor from '../../filters/category_color';
  import CategoryIcon from '../../filters/category_icon';
  import CategoryLabel from '../../filters/category_label';
  import FileSize from 'filesize';

  export default {
    data() {
      return {
        editMode: false,
        categories: [],
        category: 'FREE',
        subject: '',
        imageList: [],
        deletedImageList: [],
        isSubmitting: false
      }
    },
    created() {
      this.defers = {
        editor: $.Deferred(),
        data: $.Deferred()
      };

      $.when(this.defers.editor, this.defers.data).then(() => {
        if (this.editMode) {
          $(this.$el).find('#categories').dropdown('set selected', this.post.category.code);
          this.subject = this.post.subject;
          this.imageList = (this.post.galleries || []).map(image => {
            image.name = image.name || image.fileName;
            image.isRenaming = false;
            return image;
          });
          this.editor.setContents(this.post.content);
        }

        this.$store.commit('load', false);

        this.$nextTick(() => {
          $('.ui.sticky').sticky('refresh', true);
        });
      });
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
            _this.setDocumentTitle(post.post.subject, _this.$t('board.edit'), _this.$t('common.jakduk'));

            if (!_this.$store.state.myProfile || _this.$store.state.myProfile.id !== post.post.writer.userId) {
              window.alert(_this.$t('common.msg.error.401'));
              _this.$router.go(-1);
              return;
            }
          } else {
            _this.setDocumentTitle(_this.$t('board.write'), _this.$t('common.jakduk'));
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
    methods: {
      categoryColor: CategoryColor,
      categoryLabel: CategoryLabel,
      categoryIcon: CategoryIcon,
      onEditorCreated(editor) {
        this.editor = editor;
        this.defers.editor.resolve();
      },
      onImageUploaded(image) {
        image.isRenaming = false;
        image.name = image.name || image.fileName;
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

        if (!this.subject.length) {
          this.$store.dispatch('globalMessage', {
            level: 'info',
            message: this.$t('size.boardFreeWrite.subject')
          });
          $(this.$el).find('#subject').focus();
          return false;
        }

        const text = this.editor.getText().trim();
        if (text.length < 5 && !this.editor.hasEmbed()) {
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
            content: this.editor.getContents(),
            galleries: this.imageList.map(image => {
              return {
                id: image.id,
                fileName: image.fileName,
                size: image.size,
                name: image.newName || image.name
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
        }).then(() => {
          const promise = [];
          let reqData;

          if (this.editMode) {
            reqData = JSON.stringify({
              form: {
                from: 'BOARD_FREE',
                itemId: this.post.id
              }
            });
          }

          this.deletedImageList.forEach(image => {
            promise.push($.ajax({
              type: 'delete',
              url: `/api/gallery/${image.id}`,
              contentType: 'application/json',
              data: reqData
            }));
          });

          $.when(...promise).then(() => {
            this.isSubmitting = false;
          });
        });
      },
      insertImage(image) {
        this.editor.insertImage(image.imageUrl);
      },
      renameImage(image) {
        image.isRenaming = !image.isRenaming;

        if (image.isRenaming) {
          image.newName = image.name;
          this.$nextTick(() => {
            $(this.$el).find(`[data-image-id="${image.id}"]`).find('input').select();
          });
        }
      },
      deleteImage(image) {
        const imageIndex = this.imageList.findIndex(_image => image === _image);
        const deleted = this.imageList.splice(imageIndex, 1);
        this.deletedImageList.push(...deleted);
        this.editor.deleteImage(image.imageUrl);
      },
      enterNewImageName(image, $event) {
        if ($event.code === 'Enter' && image.newName) {
          image.name = image.newName;
        }

        image.isRenaming = false;
      }
    },
    filters: {
      fileSize: FileSize
    },
    components: {
      editor: resolve => {
        require.ensure([], require => {
          resolve(require('../../components/editor/editor.vue'));
        }, 'editor');
      },
    }
  };
</script>
