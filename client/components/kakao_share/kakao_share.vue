<script>
  import Kakao from './kakao.sdk';

  export default {
    props: {
      options: {
        type: Object,
        required: true
      },
      tag: {
        type: String,
        required: true
      }
    },
    render(createElement) {
      return createElement(
        this.tag,
        null,
        this.$slots.default
      );
    },
    mounted() {
      if (!Kakao.Link) {
        Kakao.init(this.options.kakaoClientId);
      }
    },
    updated() {
      const img = document.createElement('img');
      const options = {
        container: this.$el,
        label: this.options.label,
        webLink: {
          text: this.options.url,
          url: this.options.url
        },
        image: {
          src: this.options.thumbnailUrl
        }
      };

      img.src = this.options.thumbnailUrl;
      img.onload = function () {
        options.image.width = Math.max(80, this.naturalWidth);
        options.image.height = Math.max(80, this.naturalHeight);

        Kakao.Link.createTalkLinkButton(options);
      };
    },
    watch: {
      $route() {
        Kakao.Link.cleanup();
      }
    }
  };
</script>
