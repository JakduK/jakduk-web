export default {
  state: {
    popularSearchWords: [],
    searchResult: {
      postResult: {
        posts: []
      },
      commentResult: {
        comments: []
      },
      galleryResult: {
        galleries: []
      }
    }
  },
  mutations: {
    popularSearchWords(state, popularSearchWords) {
      state.popularSearchWords = popularSearchWords;
    },
    searchResult(state, searchResult) {
      state.searchResult = searchResult;
    }
  }
};
