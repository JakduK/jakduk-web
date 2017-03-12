import Vue from 'vue';
import {mapState} from 'vuex';
import $ from 'jquery';
import IdToRegDate from '../../filters/id_to_regdate';
import CategoryColor from '../../filters/category_color';
import CategoryIcon from '../../filters/category_icon';
import CategoryLabel from '../../filters/category_label';
import ErrorDialog from '../../utils/dialog_response_error';
import Quill from 'quill/dist/quill';

function fetch(seq) {
  return $.when(
    $.getJSON(`/api/board/free/${seq}`).then(data => data, (response, result) => result),
    $.getJSON(`/api/board/free/${seq}/comments`).then(data => data, (response, result) => result)
  );
}

function apply(post, comments) {
  post = post === 'error' ? undefined : post;
  comments = comments === 'error' ? undefined : comments;

  if (post) {
    $.extend(this, post);
  }

  if (comments) {
    this.comments = comments.comments;
    this.commentCount = comments.commentCount;
  }
}

export default {
  data() {
    return {
      post: {
        id: '',
        category: {},
        writer: {},
        numberOfLike: 0,
        numberOfDislike: 0
      },
      latestPostsByWriter: [],
      nextPost: {},
      prevPost: {},
      comments: [],
      inputComment: ''
    };
  },
  beforeRouteEnter(to, from, next) {
    fetch(to.params.seq).then((post, comments) => {
      if (post === 'error') {
        window.alert(Vue.t('common.error.occurred.on.server'));
        next(false);
      } else {
        next(_this => {
          apply.call(_this, post, comments);
          _this.$store.commit('load', false);
        });
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    fetch(to.params.seq).then((post, comments) => {
      apply.call(this, post, comments);
      next();
    });
  },
  mounted() {
    const quill = new Quill('#commentEditor', {
      theme: 'snow',
      modules: {
        toolbar: ['link', 'image', 'video']
      },
      placeholder: this.$t('Size.board.comment.content'),
      bounds: $('#main')[0]
    });

    quill.on('selection-change', (range, oldRange, source) => {
      if (!this.$store.state.isAuthenticated) {
        if (oldRange === null && window.confirm(this.$t('common.do.you.want.to.login'))) {
          window.location = `/login?redir=${encodeURIComponent(`${location.pathname}${location.search}`)}`;
        } else if (range !== null) {
          quill.setSelection(null);
        }
      }
    });

    quill.getModule('toolbar').addHandler('image', () => {
      let fileInput = quill.root.querySelector('input.ql-image[type=file]');

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
            }).done(data => {
              quill.insertEmbed(range.index, 'image', data.thumbnailUrl);
            });
          }
        });
        quill.root.appendChild(fileInput);
      }

      fileInput.click();
    });

    this.quill = quill;
  },
  updated() {
    $('.ui.sticky').sticky('refresh', true);
    $(this.$el).find('img').one('load', () => {
      $('.ui.sticky').sticky('refresh', true);
    });
  },
  computed: mapState(['isAuthenticated', 'myProfile']),
  filters: {
    IdToRegDate: IdToRegDate
  },
  methods: {
    categoryColor: CategoryColor,
    categoryLabel: CategoryLabel,
    categoryIcon: CategoryIcon,
    likeOrDislike(what) {
      $.post(`/api/board/free/${this.post.seq}/${what}`).then(data => {
        this.post.myFeeling = data.myFeeling;
        this.post.numberOfLike = data.numberOfLike;
        this.post.numberOfDislike = data.numberOfDislike;
      }, ErrorDialog(response => {
        if (response.status === 400) {
          return 'board.msg.you.are.writer';
        }
      }));
    },
    likeOrDislikeComment(comment, what) {
      $.post(`/api/board/free/comment/${comment.id}/${what}`).then(data => {
        comment.myFeeling = data.myFeeling;
        comment.numberOfLike = data.numberOfLike;
        comment.numberOfDislike = data.numberOfDislike;
      }, ErrorDialog(response => {
        if (response.status === 400) {
          return 'board.msg.you.are.writer';
        }
      }));
    },
    submitComment() {
      const commentText = this.quill.getText().trim();

      if (commentText.length < 3 || commentText.length > 800) {
        window.alert(this.$t('Size.board.comment.content'));
        return;
      }

      $.ajax({
        type: 'post',
        url: '/api/board/free/comment',
        contentType: 'application/json',
        data: JSON.stringify({
          content: this.quill.root.innerHTML,
          seq: this.post.seq
        })
      }).then(data => {
        this.comments.push(data);
        this.quill.setText('');
      });
    },
    deleteComment(comment) {
      if (window.confirm(this.$t('common.do.you.want.to.delete.a.comment'))) {
        $.ajax({
          type: 'delete',
          url: `/api/board/free/comment/${comment.id}`
        }).then(() => {
          const index = this.comments.findIndex(_comment => _comment.id === comment.id);
          this.comments.splice(index, 1);
        });
      }
    }
  }
};
