<script>
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
    created() {
      if (!Kakao.Link) {
        Kakao.init(this.options.kakaoClientId);
      }
    },
    mounted() {
      this.$el.addEventListener('click', () => {
        const options = {
          objectType: 'feed',
          content: {
            title: this.options.label,
            description: this.options.description.replace(/<\/?.+?>/g, ''),
            imageUrl: this.options.thumbnailUrl,
            link: {
              webUrl: this.options.url,
              mobileWebUrl: this.options.url
            }
          }
        };
        Kakao.Link.sendDefault(options);
      });
    },
    watch: {
      $route() {
        Kakao.Link.cleanup();
      }
    }
  };
</script>
