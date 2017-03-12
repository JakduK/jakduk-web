import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: !!window.ENV.myProfile,
    myProfile: window.ENV.myProfile,
    notification: {
      list: []
    },
    loading: true
  },
  mutations: {
    load(state, b) {
      state.loading = b;
    }
  }
});
