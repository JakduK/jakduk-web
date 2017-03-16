import Tinymce from 'tinymce/tinymce';
import $ from 'jquery';

Tinymce.baseURL = '/assets/tinymce';

const defaultOptions = {
  resize: false,
  menubar: false,
  statusbar: false,
  relative_urls: true,
  file_picker_types: 'image',
  image_description: false,
  image_dimensions: false,
  file_picker_callback(cb, value, meta) {
    const editor = this;
    const input = document.createElement('input');

    $(input).attr('type', 'file').attr('accept', 'image/*').change(function () {
      const file = this.files[0];
      const id = 'blobid' + (new Date()).getTime();
      const blobCache = editor.editorUpload.blobCache;
      const blobInfo = blobCache.create(id, file);
      blobCache.add(blobInfo);
      cb(blobInfo.blobUri(), {title: file.name});
    });

    input.click();
  },
  images_upload_handler(blobInfo, success, failure) {
    const formData = new FormData();

    formData.append('file', blobInfo.blob());

    $.ajax({
      type: 'post',
      url: '/api/gallery',
      data: formData,
      processData: false,
      contentType: false
    }).done(data => {
      success(data.imageUrl);
    });
  }
};

const commentOptions = $.extend({
  height: 150,
  plugins: [
    'advlist autolink lists link image codesample media paste'
  ],
  toolbar: 'undo redo | bold italic | codesample | bullist numlist | link image media'
}, defaultOptions);

const editorOptions = $.extend({
  height: 500,
  plugins: [
    'advlist autolink lists link image preview',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table contextmenu paste code'
  ],
  toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | preview fullscreen'
}, defaultOptions);

export default {
  props: {
    options: Object
  },
  mounted() {
    let options = $(this.$el).data('mode') === 'comment' ? commentOptions : editorOptions;
    options = $.extend({}, options, this.$props && this.$props.options);
    options.target = this.$el;
    options.init_instance_callback = function (editor) {
      this.editor = editor;
      this.$emit('on-created', editor);
    }.bind(this);

    Tinymce.init(options);
  },
  destroyed() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
};
