<template>
  <div>
    <div class="ui four doubling link cards">
      <div v-for="image in imageList" :key="image.id" class="card">
        <a :href="imageSrc(image.id)" :data-title="image.name" data-checked="false" data-lightbox="roundtrip" class="image">
          <img :src="thumbnailSrc(image.id)">
        </a>
        <div class="content">
          <p class="description">
            <img :src="avatarSrc(image.writer.picture)" class="ui bordered avatar image"> {{image.writer.username}}
          </p>
          <router-link :to="{name: 'gallery.view', params: {id: image.id}}" class="description break-all">
            {{image.name}}
          </router-link>
        </div>
        <div class="extra content text-right">
          {{image.id | IdToRegDate('LL')}}
        </div>
      </div>
    </div>
    <button @click="moreImages()" :class="{loading: isLoading}" type="button" class="ui fluid button trigger">
      <i class="icon history"></i> {{$t('common.button.more.galleries')}}
    </button>
  </div>
</template>

<style src="lightbox2/dist/css/lightbox.css"></style>
<style scoped>
  .trigger {
    margin-top: 1em;
  }
</style>

<script>
  import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic';
  import lightbox from 'lightbox2/dist/js/lightbox';
  import $ from 'jquery';
  import {mapState} from 'vuex';
  import IdToRegDate from '../../filters/id_to_regdate';

  lightbox.option({
    imageFadeDuration: 400,
    fadeDuration: 400,
    resizeDuration: 400
  });

  export default {
    data() {
      return {
        isLoading: true
      };
    },
    beforeRouteEnter(to, from, next) {
      next(_this => {
        _this.setDocumentTitle(_this.$t('gallery'), _this.$t('common.jakduk'));
      });
    },
    created() {
      $.getJSON('/api/galleries').then(data => {
        this.$store.commit('gallery', data.galleries);
        this.$store.commit('load', false);
        this.$nextTick(() => {
          this.isLoading = false;
        });
      });
    },
    updated() {
      const $images = $(this.$el).find('.image[data-checked="false"]');

      $images.attr('data-checked', true);

      $images.find('img').one('load', () => {
        $('.ui.sticky').sticky('refresh', true);
      }).one('error', function () {
        $(this).off('load');
      });
    },
    mounted() {
      this.scene = new ScrollMagic.Scene({
        triggerElement: $(this.$el).find('.trigger')[0],
        triggerHook: 'onEnter'
      })
      .addTo(new ScrollMagic.Controller())
      .on("enter", () => {
        this.moreImages();
      });
    },
    computed: mapState({
      imageList: state => state.gallery.imageList
    }),
    destroyed() {
      if (this.scene) {
        this.scene.destroy();
      }
    },
    filters: {
      IdToRegDate: IdToRegDate
    },
    methods: {
      moreImages() {
        if (this.isLoading) {
          return;
        }

        this.isLoading = true;

        $.getJSON('/api/galleries', {
          id: (this.lastElement(this.$store.state.gallery.imageList) || {}).id
        }).then(data => {
          this.$store.commit('addImages', data.galleries);
          this.$nextTick(() => {
            this.scene.update();
          });
        }).always(() => {
          this.isLoading = false;
        });
      }
    }
  };
</script>
