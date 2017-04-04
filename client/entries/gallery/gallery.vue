<template>
  <div>
    <div class="ui four doubling cards">
      <div v-for="image in imageList" :key="image.id" class="card">
        <a :href="imageSrc(image.id)" :data-title="image.name" data-checked="false" data-lightbox="roundtrip" class="blurring dimmable image">
          <div class="ui dimmer">
            <div class="content">
              <div class="center">
                <div class="ui inverted button">{{$t('common.button.view')}}</div>
              </div>
            </div>
          </div>
          <img :src="thumbnailSrc(image.id)">
        </a>
        <div class="content">
          <div class="description">
            <img v-if="image.writer.picture" :src="image.writer.picture" class="ui avatar image">
            <i v-else class="spy icon"></i>
            {{image.writer.username}}
          </div>
          <router-link :to="{name: 'gallery.view', params: {id: image.id}}" class="description break-all">
            {{image.name}}
          </router-link>
        </div>
        <div class="extra content">
          {{image.id | IdToRegDate('LL')}}
            <span class="right floated">
             <i class="eye icon"></i> {{image.views}}
            </span>
        </div>
      </div>
    </div>
    <button @click="moreImages()" :class="{loading: isLoading}" type="button" class="ui fluid button trigger">{{$t('common.button.more.galleries')}}</button>
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

      $('.ui.sticky').sticky('refresh', true);
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
