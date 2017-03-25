<template>
  <div class="__wrapper"><div></div></div>
</template>

<style src="quill/dist/quill.snow.css"></style>
<style src="highlight.js/styles/monokai-sublime.css"></style>
<style>
  .__wrapper {
    height: 100%;
    display:flex;
    flex-direction: column;
  }
  .__wrapper .ql-toolbar.ql-snow {
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-top-left-radius: 0.28571429rem;
    border-top-right-radius: 0.28571429rem;
  }
  .__wrapper .ql-container.ql-snow {
    flex: 2;
    overflow: hidden;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-bottom-left-radius: 0.28571429rem;
    border-bottom-right-radius: 0.28571429rem;
  }
</style>

<script>
  import Quill from 'quill/dist/quill';
  import $ from 'jquery';
  import Highlightjs from 'highlight.js';

  const editorToolbarOptions = [
    [{ 'font': [] }],  // custom dropdown
    [{ 'size': ['small', false, 'large', 'huge'] }],

    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

    [{ 'align': [] }, { 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent,
    ['blockquote', 'code-block'],

    ['link', 'image', 'video']
  ];

  const commentToolbarOptions = [
    ['link', 'image', 'video'],
    [{ 'align': [] }, { 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block']
  ];

  export default {
    props: {
      options: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    mounted() {
      const quill = new Quill(this.$el.children[0], {
        theme: 'snow',
        modules: {
          syntax: {
            highlight(text) {
              let result = Highlightjs.highlightAuto(text, ['javascript', 'java', 'python', 'html', 'css']);
              return result.value;
            }
          },
          toolbar: this.options.mode === 'editor' ? editorToolbarOptions : commentToolbarOptions
        },
        placeholder: this.$t('board.msg.write.text.here'),
        bounds: this.$el,
        readOnly: !this.$store.state.isAuthenticated
      });
      const toolbar = quill.getModule('toolbar');

      quill.on('selection-change', (range, oldRange, source) => {
        if (!this.$store.state.isAuthenticated) {
          if (oldRange === null && window.confirm(this.$t('common.do.you.want.to.login'))) {
            window.location = `/login?redir=${encodeURIComponent(`${location.pathname}${location.search}`)}`;
          } else if (range !== null) {
            quill.setSelection(null);
          }
        }
      });

      toolbar.addHandler('image', () => {
        if (!quill.isEnabled()) {
          return;
        }

        let fileInput = toolbar.container.querySelector('input.ql-image[type=file]');

        if (fileInput === null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml');
          fileInput.classList.add('ql-image');
          fileInput.addEventListener('change', () => {
            if (fileInput.files !== null && fileInput.files[0] !== null) {
              const range = quill.getSelection(true);
              const formData = new FormData();

              formData.append('file', fileInput.files[0]);

              $.ajax({
                type: 'post',
                url: '/api/gallery',
                data: formData,
                processData: false,
                contentType: false
              }).done(resData => {
                quill.insertEmbed(range.index, 'image', resData.imageUrl);
                this.$emit('on-image-uploaded', resData);
                fileInput.remove();
              });
            }
          });
          toolbar.container.appendChild(fileInput);
        }

        fileInput.click();
      });

      this.quill = quill;

      this.$emit('on-created', this);
    },
    methods: {
      hasEmbed() {
        const delta = this.quill.getContents();
        return delta.ops.some(op => {
          return op.insert && (op.insert.image || op.insert.video);
        });
      },
      getContentLength() {
        return this.quill.getLength();
      },
      setContents(contents) {
        this.quill.clipboard.dangerouslyPasteHTML(contents);
      },
      getContents() {
        return this.quill.root.innerHTML;
      },
      getText() {
        return this.quill.getText();
      },
      clear() {
        this.quill.setText('');
      },
      focus() {
        this.quill.focus();
      },
      insertImage(imageUrl) {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, 'image', imageUrl);
      },
      deleteImage(imageUrl) {
        this.quill.root.querySelectorAll(`img[src="${imageUrl}"]`).forEach(img => img.remove());
      }
    }
  };

</script>
