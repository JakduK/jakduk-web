import Vue from 'vue';
import Vuex from 'vuex';
import searchViewStore from './search_view/store';
import galleryStore from './gallery/store';
import galleryViewStore from './gallery_view/store';
import stats from './stats/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    err: window.ENV.err,
    isMobile: /iphone|ipad|android/i.test(window.navigator.userAgent),
    kakaoSdkKey: window.ENV.kakaoSdkKey,
    isAuthenticated: !!window.ENV.myProfile,
    isAdmin: window.ENV.myProfile && window.ENV.myProfile.roles.some(role => role === 'ROLE_ROOT'),
    myProfile: window.ENV.myProfile,
    globalMessage: [],
    notification: {
      list: []
    },
    loading: true,
    appLoaded: false
  },
  getters: {
    isMobile: state => state.isMobile,
    kakaoSdkKey: state => state.kakaoSdkKey,
    loading: state => state.loading,
    appLoaded: state => state.appLoaded
  },
  mutations: {
    appLoaded(state) {
      state.appLoaded = true;
    },
    load(state, b) {
      state.loading = b;
    },
    putGlobalMessage(state, message) {
      state.globalMessage.unshift(message);
    },
    deleteGlobalMessage(state, message) {
      const index = state.globalMessage.findIndex(_message => _message === message);
      if (index > -1) {
        state.globalMessage.splice(index, 1);
      }
    }
  },
  actions: {
    globalMessage({commit}, message) {
      if (typeof message === 'string') {
        message = {
          message: message
        };
      }

      if (!message.level) {
        message.level = 'info';
      }

      if (!parseInt(message.duration)) {
        message.duration = 3000;
      }

      commit('putGlobalMessage', message);

      setTimeout(() => {
        commit('deleteGlobalMessage', message);
      }, message.duration);
    }
  },
  modules: {
    searchView: searchViewStore,
    gallery: galleryStore,
    galleryView: galleryViewStore,
    stats: stats
  }
});
