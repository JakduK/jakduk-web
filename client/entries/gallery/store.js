export default {
  state: {
    imageList: []
  },
  mutations: {
    gallery(state, imageList) {
      state.imageList = imageList;
    },
    addImages(state, imageList) {
      state.imageList.splice(state.imageList.length, 0, ...imageList);
    }
  }
};
